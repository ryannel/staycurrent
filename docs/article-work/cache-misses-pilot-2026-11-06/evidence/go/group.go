package main

import (
	"context"
	"time"

	"golang.org/x/sync/singleflight"
)

type Card string

// Group shares one source load per key among the callers waiting for it.
// This is the exact wrapper printed in the pilot article.
type Group struct {
	sf    singleflight.Group
	Load  func(ctx context.Context, key string) (Card, error) // recheck cache, read source, fill
	Stale func(key string) (Card, bool)                      // a copy freshness still permits
}

func (g *Group) Get(ctx context.Context, key string) (Card, error) {
	ch := g.sf.DoChan(key, func() (any, error) {
		// Detach from the first caller, then give the shared load its own budget.
		lctx, cancel := context.WithTimeout(context.WithoutCancel(ctx), 120*time.Millisecond)
		defer cancel()
		return g.Load(lctx, key)
	})
	select {
	case r := <-ch:
		if r.Err != nil {
			return "", r.Err
		}
		return r.Val.(Card), nil
	case <-ctx.Done(): // this caller's deadline: leave without starting another read
		if c, ok := g.Stale(key); ok {
			return c, nil
		}
		return "", ctx.Err()
	}
}

// Attached is the counterexample: the shared load runs under the first caller's context.
type Attached struct {
	sf   singleflight.Group
	Load func(ctx context.Context, key string) (Card, error)
}

func (g *Attached) Get(ctx context.Context, key string) (Card, error) {
	ch := g.sf.DoChan(key, func() (any, error) { return g.Load(ctx, key) })
	select {
	case r := <-ch:
		if r.Err != nil {
			return "", r.Err
		}
		return r.Val.(Card), nil
	case <-ctx.Done():
		return "", ctx.Err()
	}
}
