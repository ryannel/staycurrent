#!/usr/bin/env python3
"""Two owned, disposable PostgreSQL clusters: FDW plans, snapshots and fenced movement.
Python standard library only. No Citus installation or performance benchmark.
"""
import argparse, json, os, pathlib, queue, shutil, subprocess, tempfile, threading, time, uuid
parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--bindir',required=True)
args=parser.parse_args(); binaries=pathlib.Path(args.bindir).resolve()
root=pathlib.Path(tempfile.mkdtemp(prefix='r54-distribution-',dir='/private/tmp' if pathlib.Path('/private/tmp').exists() else None))
env={k:v for k,v in os.environ.items() if not k.startswith('PG')}
env.update(PGPASSFILE=str(root/'no-passwords'),PGSERVICEFILE=str(root/'no-services'),LC_ALL='C')
(root/'no-passwords').touch(mode=0o600);(root/'no-services').touch(mode=0o600)
owner='r54_owner';nodes=[];sessions=[];result={};started_at=time.monotonic()
def run(name,*argv):
    completed=subprocess.run([str(binaries/name),*argv],env=env,text=True,capture_output=True,timeout=30)
    if completed.returncode:raise RuntimeError((name,completed.stdout,completed.stderr))
    return completed
class Session:
    def __init__(self,node,label,user=owner):
        self.node=node;self.label=label
        self.process=subprocess.Popen([str(binaries/'psql'),'-X','-qAt','-F','\t','-v','VERBOSITY=verbose','-h',str(node.sock),'-p',str(node.port),'-U',user,'-d','postgres'],env={**env,'PGAPPNAME':label},stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True,bufsize=1)
        self.lines=queue.Queue()
        threading.Thread(target=lambda:[self.lines.put(line.rstrip('\n')) for line in self.process.stdout],daemon=True).start()
        sessions.append(self)
        proof=self.sql("SELECT current_setting('cluster_name'),current_user,current_database(),pg_backend_pid();")
        values=proof[-1].split('\t');assert values[:3]==[node.tag,user,'postgres'],proof
        self.pid=int(values[3])
    def begin(self,sql):
        marker='done_'+uuid.uuid4().hex;self.process.stdin.write(sql+'\n\\echo '+marker+'\n');self.process.stdin.flush();return marker
    def finish(self,marker,timeout=15):
        end=time.monotonic()+timeout;lines=[]
        while time.monotonic()<end:
            try:line=self.lines.get(timeout=max(.01,end-time.monotonic()))
            except queue.Empty:break
            if line==marker:return lines
            lines.append(line)
        raise TimeoutError((self.label,lines))
    def sql(self,sql):return self.finish(self.begin(sql))
    def close(self):
        if self.process.poll() is None:
            self.process.stdin.write('ROLLBACK;\n\\q\n');self.process.stdin.flush()
            try:self.process.wait(timeout=3)
            except subprocess.TimeoutExpired:self.process.terminate();self.process.wait(timeout=3)
def checked(s,sql):
    lines=s.sql(sql);assert not any('ERROR:' in x for x in lines),lines;return lines
def one(s,sql):return checked(s,sql)[-1]
def literal(value):return "'"+str(value).replace("'","''")+"'"
def denied(s,sql,code='55000'):
    lines=s.sql(sql);assert any(code in x for x in lines),lines;return lines
def until(s,sql,predicate):
    end=time.monotonic()+5
    while time.monotonic()<end:
        value=one(s,sql)
        if predicate(value):return value
        time.sleep(.025)
    raise AssertionError(('not observed',sql,value))
class Node:
    def __init__(self,label,port):
        self.label=label;self.port=port;self.base=root/label;self.base.mkdir();self.data=self.base/'data';self.sock=self.base/'socket';self.sock.mkdir(mode=0o700);self.tag='r54_'+label+'_'+uuid.uuid4().hex;self.started=False;nodes.append(self)
        run('initdb','-D',str(self.data),'-U',owner,'--auth=trust','--no-locale','--encoding=UTF8')
        with (self.data/'postgresql.conf').open('a') as f:f.write(f"\nlisten_addresses=''\nunix_socket_directories='{self.sock}'\nport={port}\nmax_connections=12\nshared_buffers='16MB'\ncluster_name='{self.tag}'\n")
        run('pg_ctl','-D',str(self.data),'-l',str(self.base/'server.log'),'-w','start');self.started=True
        self.admin=Session(self,label+'_admin')
        assert one(self.admin,"SELECT current_setting('data_directory');")==str(self.data)
        assert one(self.admin,"SELECT current_setting('unix_socket_directories');")==str(self.sock)
    def stop(self):
        if self.started:
            pidfile=self.data/'postmaster.pid'
            assert pidfile.exists() and pidfile.read_text().splitlines()[1]==str(self.data),'owned postmaster identity missing'
            run('pg_ctl','-D',str(self.data),'-m','fast','-w','stop')
try:
    c=Node('coordinator_and_a',55454);a=c;b=Node('worker_b',55456)
    result['version']=one(c.admin,'SELECT version();')
    for node in [a,b]:
        checked(node.admin,"""CREATE SCHEMA shop;
        CREATE TABLE shop.products(shop_id integer,product_id text,name text,price numeric(8,2),revision integer NOT NULL DEFAULT 0,PRIMARY KEY(shop_id,product_id));
        CREATE TABLE shop.order_items(shop_id integer,order_id integer,line_no integer,product_id text,quantity integer,unit_price numeric(8,2),PRIMARY KEY(shop_id,order_id,line_no),FOREIGN KEY(shop_id,product_id) REFERENCES shop.products(shop_id,product_id));
        CREATE VIEW public.node_identity AS SELECT current_setting('cluster_name') AS marker,current_setting('data_directory') AS data_path,current_user::text AS login;
        CREATE ROLE shard_runtime LOGIN;
        REVOKE CREATE ON SCHEMA public FROM PUBLIC;
        CREATE TABLE shop.ownership(shop_id integer PRIMARY KEY,epoch integer NOT NULL,accepts_writes boolean NOT NULL);
        CREATE TABLE shop.applied(shop_id integer,operation_id text,PRIMARY KEY(shop_id,operation_id));
        CREATE FUNCTION shop.apply_note(p_shop integer,p_epoch integer,p_operation text) RETURNS integer
        LANGUAGE plpgsql SECURITY DEFINER SET search_path=pg_catalog,pg_temp AS $$
        DECLARE v_epoch integer;v_active boolean;v_revision integer;
        BEGIN
          SELECT epoch,accepts_writes INTO v_epoch,v_active FROM shop.ownership WHERE shop_id=p_shop FOR UPDATE;
          IF NOT FOUND OR NOT v_active OR v_epoch<>p_epoch THEN
            RAISE EXCEPTION 'ownership refused' USING ERRCODE='55000';
          END IF;
          IF NOT EXISTS(SELECT FROM shop.applied WHERE shop_id=p_shop AND operation_id=p_operation) THEN
            UPDATE shop.products SET revision=revision+1 WHERE shop_id=p_shop AND product_id='P7';
            INSERT INTO shop.applied VALUES(p_shop,p_operation);
          END IF;
          SELECT revision INTO v_revision FROM shop.products WHERE shop_id=p_shop AND product_id='P7';
          RETURN v_revision;
        END $$;
        REVOKE ALL ON FUNCTION shop.apply_note(integer,integer,text) FROM PUBLIC;
        GRANT USAGE ON SCHEMA shop TO shard_runtime;
        GRANT EXECUTE ON FUNCTION shop.apply_note(integer,integer,text) TO shard_runtime;
        """)
    checked(a.admin,"INSERT INTO shop.products(shop_id,product_id,name,price) VALUES(10,'P3','Green tea, 50 g',4.50),(10,'P7','Blue mug',20.00),(10,'P9','Teapot',35.00); INSERT INTO shop.order_items VALUES(10,103,1,'P7',1,20.00),(10,103,2,'P3',2,4.50); INSERT INTO shop.ownership VALUES(20,2,false);")
    checked(b.admin,"INSERT INTO shop.products(shop_id,product_id,name,price) VALUES(20,'P7','Copper mug',18.00); INSERT INTO shop.ownership VALUES(20,1,true);")
    checked(c.admin,'CREATE EXTENSION postgres_fdw;')
    result['fdw_version']=one(c.admin,"SELECT extversion FROM pg_extension WHERE extname='postgres_fdw';")
    for node,prefix in [(a,'a'),(b,'b')]:
        checked(c.admin,f"""CREATE SERVER {prefix}_server FOREIGN DATA WRAPPER postgres_fdw OPTIONS(host '{node.sock}',port '{node.port}',dbname 'postgres');
        CREATE USER MAPPING FOR {owner} SERVER {prefix}_server OPTIONS(user '{owner}');
        CREATE FOREIGN TABLE {prefix}_identity(marker text,data_path text,login text) SERVER {prefix}_server OPTIONS(schema_name 'public',table_name 'node_identity');""")
        assert one(c.admin,f'SELECT marker,data_path,login FROM {prefix}_identity;')=='\t'.join([node.tag,str(node.data),owner])
        checked(c.admin,f"""CREATE FOREIGN TABLE {prefix}_products(shop_id integer,product_id text,name text,price numeric(8,2),revision integer) SERVER {prefix}_server OPTIONS(schema_name 'shop',table_name 'products');
        CREATE FOREIGN TABLE {prefix}_items(shop_id integer,order_id integer,line_no integer,product_id text,quantity integer,unit_price numeric(8,2)) SERVER {prefix}_server OPTIONS(schema_name 'shop',table_name 'order_items');""")
    checked(c.admin,'CREATE VIEW all_products AS SELECT * FROM a_products UNION ALL SELECT * FROM b_products;')
    receipt="SELECT i.product_id,p.name,i.quantity*i.unit_price AS line_total FROM a_items i JOIN a_products p USING(shop_id,product_id) WHERE i.shop_id=10 AND i.order_id=103 ORDER BY i.line_no"
    result['receipt_plan']=checked(c.admin,'EXPLAIN(VERBOSE,COSTS OFF) '+receipt+';')
    assert any('INNER JOIN' in line and 'Relations:' in line for line in result['receipt_plan']),result['receipt_plan']
    assert any('Remote SQL:' in line and 'order_id = 103' in line and 'shop_id = 10' in line for line in result['receipt_plan'])
    result['receipt_rows']=checked(c.admin,receipt+';');assert result['receipt_rows']==['P7\tBlue mug\t20.00','P3\tGreen tea, 50 g\t9.00']
    result['global_plan']=checked(c.admin,"EXPLAIN(VERBOSE,COSTS OFF) SELECT shop_id,name FROM all_products WHERE product_id='P7' ORDER BY shop_id;")
    assert sum('Remote SQL:' in line for line in result['global_plan'])==2,result['global_plan']
    assert any('Append' in line for line in result['global_plan'])
    assert checked(c.admin,"SELECT shop_id,name FROM all_products WHERE product_id='P7' ORDER BY shop_id;")==['10\tBlue mug','20\tCopper mug']
    checked(c.admin,'BEGIN ISOLATION LEVEL READ COMMITTED;')
    first_a=one(c.admin,"SELECT price FROM a_products WHERE shop_id=10 AND product_id='P7';")
    checked(a.admin,"UPDATE shop.products SET price=21 WHERE shop_id=10 AND product_id='P7';")
    checked(b.admin,"UPDATE shop.products SET price=19 WHERE shop_id=20 AND product_id='P7';")
    repeated_a=one(c.admin,"SELECT price FROM a_products WHERE shop_id=10 AND product_id='P7';")
    first_b=one(c.admin,"SELECT price FROM b_products WHERE shop_id=20 AND product_id='P7';")
    assert [first_a,repeated_a,first_b]==['20.00','20.00','19.00']
    result['snapshot']={'first_a':first_a,'a_commit':'21.00','b_later_commit':'19.00','repeat_a':repeated_a,'first_b':first_b}
    checked(c.admin,'ROLLBACK;');checked(a.admin,"UPDATE shop.products SET price=20 WHERE shop_id=10 AND product_id='P7';");checked(b.admin,"UPDATE shop.products SET price=18 WHERE shop_id=20 AND product_id='P7';")
    # Explicit application-managed copy; there is no automatic FDW shard movement.
    checked(a.admin,"INSERT INTO shop.products(shop_id,product_id,name,price) VALUES(20,'P7','Copper mug',18.00);")
    source=Session(b,'source_writer','shard_runtime');inflight=Session(b,'inflight_writer','shard_runtime');racing=Session(b,'racing_writer','shard_runtime');target=Session(a,'target_writer','shard_runtime');fence=Session(b,'fence_admin')
    denied(source,"UPDATE shop.products SET revision=999;",'42501')
    assert one(source,"SELECT shop.apply_note(20,1,'before-fence');")=='1'
    assert one(a.admin,"SELECT revision FROM shop.products WHERE shop_id=20;")=='0'
    checked(inflight,'BEGIN;');assert one(inflight,"SELECT shop.apply_note(20,1,'in-flight');")=='2'
    fence_marker=fence.begin('BEGIN; UPDATE shop.ownership SET accepts_writes=false,epoch=2 WHERE shop_id=20; COMMIT;')
    until(b.admin,f'SELECT {inflight.pid}=ANY(pg_blocking_pids({fence.pid}));',lambda x:x=='t')
    racing_marker=racing.begin("SELECT shop.apply_note(20,1,'racing-fence');")
    until(b.admin,f'SELECT cardinality(pg_blocking_pids({racing.pid}))>0;',lambda x:x=='t')
    checked(inflight,'COMMIT;');assert not any('ERROR:' in x for x in fence.finish(fence_marker))
    race_lines=racing.finish(racing_marker);assert any('55000' in x for x in race_lines),race_lines
    denied(source,"SELECT shop.apply_note(20,1,'stale-route');")
    denied(target,"SELECT shop.apply_note(20,2,'too-early');")
    final_rows=checked(b.admin,"SELECT shop_id,product_id,name,price,revision FROM shop.products WHERE shop_id=20 ORDER BY product_id;")
    final_journal=checked(b.admin,"SELECT operation_id FROM shop.applied WHERE shop_id=20 ORDER BY operation_id;")
    assert final_journal==['before-fence','in-flight']
    assert one(b.admin,'SELECT epoch,accepts_writes FROM shop.ownership WHERE shop_id=20;')=='2\tf'
    copied=final_rows[0].split('\t');assert copied[:2]==['20','P7']
    product_values=','.join(literal(value) for value in copied)
    journal_values=','.join('(20,'+literal(operation)+')' for operation in final_journal)
    checked(a.admin,'BEGIN; DELETE FROM shop.products WHERE shop_id=20; INSERT INTO shop.products VALUES('+product_values+'); INSERT INTO shop.applied VALUES '+journal_values+'; COMMIT;')
    assert checked(a.admin,"SELECT shop_id,product_id,name,price,revision FROM shop.products WHERE shop_id=20 ORDER BY product_id;")==final_rows
    assert checked(a.admin,"SELECT operation_id FROM shop.applied WHERE shop_id=20 ORDER BY operation_id;")==final_journal
    assert one(a.admin,'SELECT epoch,accepts_writes FROM shop.ownership WHERE shop_id=20;')=='2\tf'
    checked(a.admin,'UPDATE shop.ownership SET accepts_writes=true WHERE shop_id=20;')
    assert one(target,"SELECT shop.apply_note(20,2,'after-move');")=='3'
    assert one(target,"SELECT shop.apply_note(20,2,'in-flight');")=='3'
    denied(source,"SELECT shop.apply_note(20,1,'late-old-route');")
    result['movement']={'initial_copy_revision':0,'source_final_revision':2,'source_final_journal':final_journal,'fence_waited_for_inflight':True,'racing_write_refused':True,'inactive_target_refused':True,'final_target_revision':3,'retried_operation_did_not_increment':True,'old_route_refused':True,'direct_runtime_update_refused':True}
    result['final_canonical_prices']={'a_shop10':one(a.admin,"SELECT price FROM shop.products WHERE shop_id=10 AND product_id='P7';"),'b_shop20':one(b.admin,"SELECT price FROM shop.products WHERE shop_id=20 AND product_id='P7';"),'a_shop20_copy':one(a.admin,"SELECT price FROM shop.products WHERE shop_id=20 AND product_id='P7';")}
    assert list(result['final_canonical_prices'].values())==['20.00','18.00','18.00']
    result['success']=True;result['elapsed_seconds']=round(time.monotonic()-started_at,3)
    print(json.dumps(result,indent=2))
finally:
    for session in reversed(sessions):
        try:session.close()
        except Exception:pass
    for node in reversed(nodes):node.stop()
    shutil.rmtree(root)
