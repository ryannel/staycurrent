// Disposable experiments for the cache-misses pilot article.
package main

import (
	"context"
	"flag"
	"fmt"
	"sync"
	"sync/atomic"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
	"golang.org/x/sync/singleflight"
)

const cardKey = "product:v1:north:P7:en-GB:GBP"
const listKey = "list:v1:north:under-2100:en-GB:GBP:page1"

var (
	ctx  = context.Background()
	pool *pgxpool.Pool
	rdb  *redis.Client
	t0   time.Time
)

func ms() string { return fmt.Sprintf("%4d ms", time.Since(t0).Milliseconds()) }

func calls(like string) int64 {
	var n int64
	pool.QueryRow(ctx, "select coalesce(sum(calls),0) from pg_stat_statements where query like $1 and query not like '%pg_stat%'", like).Scan(&n)
	return n
}
func reset() { pool.Exec(ctx, "select pg_stat_statements_reset()") }

// readCard models card assembly with pg_sleep, so durations are modelled, counts observed.
func readCard(c context.Context, fill time.Duration) (Card, error) {
	var s string
	err := pool.QueryRow(c, "select name || ':' || price_pence /*card*/ from products, pg_sleep($2::float8/1000) where id = $1", "P7", fill.Milliseconds()).Scan(&s)
	return Card(s), err
}

func main() {
	exp := flag.String("exp", "wrapper", "wrapper | stampede | lease")
	mode := flag.String("mode", "naive", "stampede: naive | perproc | lease")
	rate := flag.Int("rate", 400, "arrivals per second")
	dur := flag.Int("dur", 1000, "arrival window ms")
	fill := flag.Int("fill", 150, "modelled fill ms")
	inst := flag.Int("inst", 20, "instances for perproc")
	poolMax := flag.Int("pool", 280, "pool size")
	stmt := flag.Int("stmt", 0, "statement_timeout ms for lease owner A (0=off)")
	plain := flag.Bool("plain", false, "lease: A publishes and releases without owner checks")
	flag.Parse()
	var err error
	pool, err = pgxpool.New(ctx, fmt.Sprintf("host=127.0.0.1 port=5498 user=postgres dbname=postgres pool_max_conns=%d", *poolMax))
	if err != nil {
		panic(err)
	}
	defer pool.Close()
	rdb = redis.NewClient(&redis.Options{Addr: "127.0.0.1:6398"})
	// Warm the pool so connection setup does not distort timings.
	var wg sync.WaitGroup
	for i := 0; i < *poolMax && i < 60; i++ {
		wg.Add(1)
		go func() { defer wg.Done(); pool.Exec(ctx, "select 1") }()
	}
	wg.Wait()
	switch *exp {
	case "wrapper":
		wrapper()
	case "stampede":
		stampede(*mode, *rate, *dur, time.Duration(*fill)*time.Millisecond, *inst)
	case "lease":
		lease(*stmt, *plain)
	}
}

func wrapper() {
	for _, run := range []struct {
		name        string
		fill        time.Duration
		attached    bool
		stale       bool
	}{
		{"detached, 100 ms fill, no stale copy", 100 * time.Millisecond, false, false},
		{"detached, 100 ms fill, stale copy permitted", 100 * time.Millisecond, false, true},
		{"detached, 300 ms fill (over 120 ms budget)", 300 * time.Millisecond, false, false},
		{"counterexample: load attached to first caller", 100 * time.Millisecond, true, false},
	} {
		rdb.Del(ctx, cardKey)
		reset()
		var loads atomic.Int32
		load := func(c context.Context, key string) (Card, error) {
			loads.Add(1)
			if v, err := rdb.Get(c, key).Result(); err == nil {
				return Card(v), nil
			}
			card, err := readCard(c, run.fill)
			if err != nil {
				return "", err
			}
			rdb.Set(context.WithoutCancel(c), key, string(card), 30*time.Second)
			return card, nil
		}
		g := &Group{Load: load, Stale: func(string) (Card, bool) {
			return "Blue mug:2000 (observed 24 s ago)", run.stale
		}}
		a := &Attached{Load: load}
		get := func(c context.Context) (Card, error) {
			if run.attached {
				return a.Get(c, cardKey)
			}
			return g.Get(c, cardKey)
		}
		fmt.Printf("\n== %s\n", run.name)
		t0 = time.Now()
		var wg sync.WaitGroup
		for _, caller := range []struct {
			name     string
			at, wait time.Duration
		}{{"A", 0, 50 * time.Millisecond}, {"B", 20 * time.Millisecond, 150 * time.Millisecond}, {"C", 40 * time.Millisecond, 150 * time.Millisecond}} {
			wg.Add(1)
			go func() {
				defer wg.Done()
				time.Sleep(caller.at)
				c, cancel := context.WithTimeout(ctx, caller.wait)
				defer cancel()
				v, err := get(c)
				if err != nil {
					fmt.Printf("%s  caller %s error: %v\n", ms(), caller.name, err)
				} else {
					fmt.Printf("%s  caller %s card: %s\n", ms(), caller.name, v)
				}
			}()
		}
		wg.Wait()
		time.Sleep(400 * time.Millisecond)
		var active int
		pool.QueryRow(ctx, "select count(*) from pg_stat_activity where query like '%/*card*/%' and state='active' and pid<>pg_backend_pid()").Scan(&active)
		fmt.Printf("loads started %d, source queries (pg_stat_statements, completed) %d, still active %d\n", loads.Load(), calls("%/*card*/%"), active)
	}
}

func stampede(mode string, rate, durMs int, fill time.Duration, inst int) {
	rdb.Del(ctx, cardKey)
	reset()
	groups := make([]singleflight.Group, inst)
	var started, firstFill atomic.Int64
	load := func() {
		started.Add(1)
		var s string
		if err := pool.QueryRow(ctx, "select name || ':' || price_pence /*card*/ from products, pg_sleep($2::float8/1000) where id = $1", "P7", fill.Milliseconds()).Scan(&s); err != nil {
			fmt.Println("err", err)
			return
		}
		rdb.Set(ctx, cardKey, s, 30*time.Second)
		firstFill.CompareAndSwap(0, time.Since(t0).Milliseconds())
	}
	n := rate * durMs / 1000
	gap := time.Second / time.Duration(rate)
	var wg sync.WaitGroup
	var peak atomic.Int64
	stop := make(chan struct{})
	go func() {
		for {
			select {
			case <-stop:
				return
			case <-time.After(10 * time.Millisecond):
				var a int64
				pool.QueryRow(ctx, "select count(*) from pg_stat_activity where query like '%/*card*/%' and state='active' and pid<>pg_backend_pid()").Scan(&a)
				if a > peak.Load() {
					peak.Store(a)
				}
			}
		}
	}()
	t0 = time.Now()
	for i := 0; i < n; i++ {
		target := time.Duration(i) * gap
		if d := target - time.Since(t0); d > 0 {
			time.Sleep(d)
		}
		wg.Add(1)
		go func(i int) {
			defer wg.Done()
			if _, err := rdb.Get(ctx, cardKey).Result(); err == nil {
				return
			}
			switch mode {
			case "naive":
				load()
			case "perproc":
				g := &groups[i%inst]
				g.Do(cardKey, func() (any, error) {
					if _, err := rdb.Get(ctx, cardKey).Result(); err == nil {
						return nil, nil
					}
					load()
					return nil, nil
				})
			}
		}(i)
	}
	wg.Wait()
	close(stop)
	fmt.Printf("mode=%s rate=%d/s window=%d ms fill=%v: requests %d, loads %d, source queries %d, first fill landed at %d ms, peak active %d\n",
		mode, rate, durMs, fill, n, started.Load(), calls("%/*card*/%"), firstFill.Load(), peak.Load())
}

func lease(stmtMs int, plain bool) {
	leaseKey := "lease:" + listKey
	rdb.Del(ctx, listKey, leaseKey)
	reset()
	publish := redis.NewScript(`if redis.call('GET', KEYS[1]) == ARGV[1] then redis.call('SET', KEYS[2], ARGV[2], 'PX', ARGV[3]) return 1 else return 0 end`)
	release := redis.NewScript(`if redis.call('GET', KEYS[1]) == ARGV[1] then return redis.call('DEL', KEYS[1]) else return 0 end`)
	compute := func(c context.Context, who string, d time.Duration, timeout int) (string, error) {
		conn, err := pool.Acquire(c)
		if err != nil {
			return "", err
		}
		defer conn.Release()
		if timeout > 0 {
			conn.Exec(c, fmt.Sprintf("set statement_timeout = %d", timeout))
			defer conn.Exec(context.Background(), "reset statement_timeout")
		}
		var s string
		err = conn.QueryRow(c, "select string_agg(id, ',' order by price_pence) /*list*/ from products, pg_sleep($1::float8/1000) where price_pence < 2100", d.Milliseconds()).Scan(&s)
		return who + ":" + s, err
	}
	say := func(f string, a ...any) { fmt.Printf("%s  "+f+"\n", append([]any{ms()}, a...)...) }
	t0 = time.Now()
	var wg sync.WaitGroup
	wg.Add(2)
	go func() { // Server A: takes a 200 ms lease, then its query stalls for 900 ms.
		defer wg.Done()
		ok, _ := rdb.SetNX(ctx, leaseKey, "tokA", 200*time.Millisecond).Result()
		say("A  SET %s tokA NX PX 200 -> %v", leaseKey, ok)
		v, err := compute(ctx, "A", 900*time.Millisecond, stmtMs)
		if err != nil {
			say("A  source query ended: %v", err)
			n, _ := release.Run(ctx, rdb, []string{leaseKey}, "tokA").Int()
			say("A  owner-checked release -> %d", n)
			return
		}
		say("A  source query finished")
		if plain {
			rdb.Set(ctx, listKey, v, 30*time.Second)
			say("A  plain SET of its list -> OK")
			return
		}
		n, _ := publish.Run(ctx, rdb, []string{leaseKey, listKey}, "tokA", v, 30000).Int()
		say("A  owner-checked publish -> %d", n)
		n, _ = release.Run(ctx, rdb, []string{leaseKey}, "tokA").Int()
		say("A  owner-checked release -> %d", n)
	}()
	go func() { // Server B: a request at 210 ms finds no fresh list and no lease.
		defer wg.Done()
		time.Sleep(10 * time.Millisecond)
		ok, _ := rdb.SetNX(ctx, leaseKey, "tokB", 200*time.Millisecond).Result()
		say("B  SET %s tokB NX PX 200 -> %v (waits or serves stale)", leaseKey, ok)
		time.Sleep(200 * time.Millisecond)
		ok, _ = rdb.SetNX(ctx, leaseKey, "tokB", 200*time.Millisecond).Result()
		say("B  SET %s tokB NX PX 200 -> %v", leaseKey, ok)
		go func() {
			time.Sleep(50 * time.Millisecond)
			var active int
			pool.QueryRow(ctx, "select count(*) from pg_stat_activity where query like '%/*list*/%' and state='active' and pid<>pg_backend_pid()").Scan(&active)
			say("   pg_stat_activity: %d active list computations", active)
		}()
		v, err := compute(ctx, "B", 150*time.Millisecond, 0)
		if err != nil {
			say("B  error %v", err)
			return
		}
		n, _ := publish.Run(ctx, rdb, []string{leaseKey, listKey}, "tokB", v, 30000).Int()
		say("B  owner-checked publish -> %d", n)
		n, _ = release.Run(ctx, rdb, []string{leaseKey}, "tokB").Int()
		say("B  owner-checked release -> %d", n)
	}()
	wg.Wait()
	v, _ := rdb.Get(ctx, listKey).Result()
	say("cached list written by %s", v[:1])
	fmt.Printf("list computations completed or cancelled (pg_stat_statements calls): %d\n", calls("%/*list*/%"))
}
