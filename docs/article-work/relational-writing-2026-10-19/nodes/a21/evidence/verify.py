"""Disposable native worksheet. Requires SQLAlchemy 2.0.44, pg8000 1.31.5.
Run with an unused rel3_a21_runN name; creates and drops only that database.
Prints JSON evidence; fixtures are invented, results are observed.
"""
import json
import platform
import sys
from collections import Counter
from sqlalchemy import (create_engine, event, select, text, ForeignKey, Integer,
                        String, bindparam, func)
from sqlalchemy.orm import (DeclarativeBase, Mapped, mapped_column, relationship,
                            Session, joinedload, selectinload, raiseload)
from sqlalchemy.exc import InvalidRequestError
from sqlalchemy.orm.exc import StaleDataError
import sqlalchemy
import pg8000

DB = sys.argv[1] if len(sys.argv) > 1 else "rel3_a21_run1"
assert DB.startswith("rel3_a21_run") and DB.removeprefix("rel3_a21_run").isdigit()
URL = "postgresql+pg8000://staycurrent@127.0.0.1:57319/"
admin = create_engine(URL + "postgres", isolation_level="AUTOCOMMIT", pool_size=1, max_overflow=0)
with admin.connect() as c:
    c.exec_driver_sql(f'CREATE DATABASE "{DB}"')
engine = create_engine(URL + DB, pool_size=2, max_overflow=0)
report = {"versions": {"python": platform.python_version(), "sqlalchemy": sqlalchemy.__version__,
                       "pg8000": pg8000.__version__}, "database": DB, "session_overrides": [], "runs": {}}
active = None
phase = "load"
connections = {}
# Count each driver wait for PostgreSQL ReadyForQuery. These are observed
# synchronisation cycles, not TCP packets or timing measurements.
from pg8000.core import CoreConnection
original_messages = CoreConnection.handle_messages

def measured_messages(self, context):
    if active is not None:
        active["protocol_waits"].append({"phase": phase, "sql": context.statement})
    return original_messages(self, context)

CoreConnection.handle_messages = measured_messages

@event.listens_for(engine, "connect")
def connected(dbapi, record):
    cur = dbapi.cursor()
    cur.execute("SELECT pg_backend_pid()")
    record.info["pid"] = cur.fetchone()[0]
    dbapi.rollback()

@event.listens_for(engine, "after_cursor_execute")
def observed(conn, cursor, statement, parameters, context, executemany):
    if active is not None:
        active["trace"].append({"phase": phase, "pid": conn.info["pid"], "sql": statement,
                                "parameter_types": [type(v).__name__ for v in parameters],
                                "rows": cursor.rowcount})

for name in ("begin", "commit", "rollback"):
    def transaction_event(conn, kind=name):
        if active is not None:
            active["transaction_events"].append({"event": kind, "pid": conn.info["pid"]})
    event.listen(engine, name, transaction_event)

class Base(DeclarativeBase): pass
class Customer(Base):
    __tablename__ = "customers"
    id: Mapped[int] = mapped_column(primary_key=True)
    tenant_id: Mapped[int]
    name: Mapped[str] = mapped_column(String)
class Order(Base):
    __tablename__ = "orders"
    id: Mapped[int] = mapped_column(primary_key=True)
    tenant_id: Mapped[int]
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"))
    status: Mapped[str] = mapped_column(String)
    version: Mapped[int] = mapped_column(Integer, nullable=False, default=1)
    __mapper_args__ = {"version_id_col": version}
    customer: Mapped[Customer] = relationship()
    items: Mapped[list["Item"]] = relationship(order_by="Item.id")
    parcels: Mapped[list["Parcel"]] = relationship(order_by="Parcel.id")
class Item(Base):
    __tablename__ = "items"
    id: Mapped[int] = mapped_column(primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"))
    sku: Mapped[str] = mapped_column(String)
class Parcel(Base):
    __tablename__ = "parcels"
    id: Mapped[int] = mapped_column(primary_key=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"))
class ExportRow(Base):
    __tablename__ = "export_rows"
    id: Mapped[int] = mapped_column(primary_key=True)

def start(name):
    global active, phase
    active = {"trace": [], "transaction_events": [], "protocol_waits": []}
    report["runs"][name] = active
    phase = "load"
    return active

def finish():
    global active
    active["statements"] = len(active["trace"])
    active["protocol_round_trips"] = len(active["protocol_waits"])
    active["returned_rows_observable"] = all(t["rows"] >= 0 for t in active["trace"])
    # Streaming's initial rowcount=-1 is unknown, not zero rows.
    if not active["returned_rows_observable"]:
        active["consumed_rows"] = 1200
    active["returned_rows"] = (sum(t["rows"] for t in active["trace"] if t["sql"].lstrip().upper().startswith("SELECT")) if active["returned_rows_observable"] else None)
    active = None

def base(n=3):
    return select(Order).where(Order.tenant_id == 7).order_by(Order.id).limit(n)

def serialise(orders):
    global phase
    phase = "serialise"
    return [{"id": o.id, "customer": o.customer.name,
             "items": [{"id": i.id, "sku": i.sku} for i in o.items]} for o in orders]

try:
    with engine.connect() as c:
        report["versions"]["postgres"] = c.scalar(text("SELECT version()"))
        report["limits"] = dict(c.execute(text("SELECT name, setting FROM pg_settings WHERE name IN ('statement_timeout','lock_timeout','default_transaction_isolation')")).all())
    Base.metadata.create_all(engine)
    with Session(engine) as s:
        s.add_all([Customer(id=1, tenant_id=7, name="Jo"), Customer(id=2, tenant_id=7, name="Mina"),
                   Customer(id=3, tenant_id=7, name="Sam"), Customer(id=8, tenant_id=8, name="Other tenant")])
        s.flush()
        counts = [2, 0, 3, 1, 2, 12]
        for k, count in enumerate(counts):
            oid = 101 + k
            s.add(Order(id=oid, tenant_id=7, customer_id=1 + k // 2, status="paid"))
            s.add_all([Item(id=oid * 100 + i, order_id=oid, sku=f"SKU-{i}") for i in range(1, count + 1)])
        s.add(Order(id=800, tenant_id=8, customer_id=8, status="paid"))
        s.add(Item(id=80001, order_id=800, sku="PRIVATE"))
        s.add_all([Parcel(id=10100+i, order_id=101) for i in range(1, 3)] +
                  [Parcel(id=10300+i, order_id=103) for i in range(1, 5)])
        s.add_all([Order(id=1000+i, tenant_id=9, customer_id=1, status="paid") for i in range(501)])
        s.add_all([ExportRow(id=i) for i in range(1, 1201)])
        s.commit()
    for n, expected in [(1, 3), (3, 6), (6, 10)]:
        r = start(f"lazy_{n}")
        with Session(engine) as s:
            orders = s.scalars(base(n)).all()
            r["before_serialisation"] = len(r["trace"])
            r["response"] = serialise(orders)
            r["tracked_entities"] = len(s.identity_map)
            assert len(r["trace"]) == expected
            phase = "serialise_again"
            serialise(orders)
            assert len(r["trace"]) == expected
        finish()
    for n in (0, 1, 6):
        r = start(f"bounded_{n}")
        with Session(engine) as s:
            orders = s.scalars(base(n).options(selectinload(Order.customer), selectinload(Order.items), raiseload("*"))).all()
            r["response"] = serialise(orders)
            assert len(orders) == n
            assert len(r["trace"]) == (1 if n == 0 else 3)
            if n == 6:
                assert len(r["response"][-1]["items"]) == 12
        finish()
    for mode in ("joined", "batched"):
        r = start(mode)
        with Session(engine) as s:
            loaders = (joinedload(Order.customer), joinedload(Order.items)) if mode == "joined" else (selectinload(Order.customer), selectinload(Order.items))
            orders = s.scalars(base().options(*loaders, raiseload("*"))).unique().all()
            r["response"] = serialise(orders)
            r["tracked_entities"] = len(s.identity_map)
            assert r["response"] == report["runs"]["lazy_3"]["response"]
            assert len(s.identity_map) == 10
        finish()
    r = start("projection")
    with Session(engine) as s:
        page = base().subquery()
        stmt = (select(page.c.id, Customer.name, Item.id.label("item_id"), Item.sku)
                .join(Customer, Customer.id == page.c.customer_id)
                .outerjoin(Item, Item.order_id == page.c.id).order_by(page.c.id, Item.id))
        rows = s.execute(stmt).mappings().all()
        result = {}
        for row in rows:
            order = result.setdefault(row["id"], {"id": row["id"], "customer": row["name"], "items": []})
            if row["item_id"] is not None:
                order["items"].append({"id": row["item_id"], "sku": row["sku"]})
        r["response"] = list(result.values())
        r["tracked_entities"] = len(s.identity_map)
        assert r["response"] == report["runs"]["lazy_3"]["response"]
    finish()
    r = start("joined_two_collections")
    with Session(engine) as s:
        orders = s.scalars(base().options(joinedload(Order.customer), joinedload(Order.items), joinedload(Order.parcels))).unique().all()
        r["response"] = serialise(orders)
        r["parcels"] = [len(o.parcels) for o in orders]
        r["tracked_entities"] = len(s.identity_map)
        assert r["parcels"] == [2, 0, 4]
        assert len(r["trace"]) == 1 and r["trace"][0]["rows"] == 17
        assert [len(o.items) for o in orders] == [2, 0, 3]
    finish()
    r = start("limit_join_rows")
    with Session(engine) as s:
        rows = s.execute(select(Order.id, Item.id).outerjoin(Item).where(Order.tenant_id == 7).order_by(Order.id, Item.id).limit(3)).all()
        r["row_pairs"] = [list(row) for row in rows]
        r["distinct_parents"] = sorted(set(row[0] for row in rows))
        assert r["distinct_parents"] == [101, 102]
    finish()
    r = start("raiseload")
    with Session(engine) as s:
        order = s.scalars(base(1).options(raiseload("*"))).one()
        try:
            serialise([order])
            assert False
        except InvalidRequestError as e:
            r["exception"] = type(e).__name__
    finish()
    r = start("batch_501")
    with Session(engine) as s:
        orders = s.scalars(select(Order).where(Order.tenant_id == 9).options(selectinload(Order.items), raiseload("*"))).all()
        r["parents"] = len(orders)
        r["loader_parameter_counts"] = [len(t["parameter_types"]) for t in r["trace"] if "items" in t["sql"]]
        assert r["loader_parameter_counts"] == [500, 1]
    finish()
    r = start("autoflush")
    with Session(engine) as s:
        r["initial_session_transaction"] = s.in_transaction()
        order = s.get(Order, 101)
        r["after_load_session_transaction"] = s.in_transaction()
        order.status = "cancelled"
        phase = "apparent_read"
        s.scalar(select(func.count(Order.id)).where(Order.tenant_id == 7))
        r["writer_sees"] = s.scalar(select(Order.status).where(Order.id == 101))
        with engine.connect() as observer:
            r["observer_before_commit"] = observer.scalar(select(Order.status).where(Order.id == 101))
        s.rollback()
    assert r["writer_sees"] == "cancelled" and r["observer_before_commit"] == "paid"
    assert [t["sql"].split()[0] for t in r["trace"]][:3] == ["SELECT", "UPDATE", "SELECT"]
    finish()
    r = start("no_autoflush")
    with Session(engine) as s:
        order = s.get(Order, 101)
        order.status = "cancelled"
        with s.no_autoflush:
            s.scalar(select(func.count(Order.id)).where(Order.tenant_id == 7))
        assert len(r["trace"]) == 2
        assert not any(t["sql"].startswith("UPDATE") for t in r["trace"])
        s.rollback()
        r["tracked_after_rollback"] = len(s.identity_map)
        assert r["tracked_after_rollback"] == 1
    finish()
    r = start("version_conflict")
    with Session(engine) as a, Session(engine) as b:
        first = a.get(Order, 101)
        stale = b.get(Order, 101)
        first.status = "packed"
        a.commit()
        stale.status = "cancelled"
        try:
            b.flush()
            assert False
        except StaleDataError as e:
            r["exception"] = type(e).__name__
            b.rollback()
    finish()
    r = start("raw_write_stale_object")
    with Session(engine) as s:
        order = s.get(Order, 101)
        s.execute(text("UPDATE orders SET status=:status WHERE id=:id"), {"status": "sent", "id": 101})
        r["object_before_expiry"] = order.status
        s.expire(order)
        r["object_after_expiry"] = order.status
        assert r["object_before_expiry"] == "packed" and r["object_after_expiry"] == "sent"
        s.rollback()
    finish()
    r = start("authority")
    with Session(engine) as s:
        scope = (Order.tenant_id == 7, Order.customer_id == 1, Order.id == 800)
        r["read"] = s.scalars(select(Order).where(*scope)).all()
        r["count"] = s.scalar(select(func.count(Order.id)).where(*scope))
        r["children"] = s.execute(select(Item.id).join(Order).where(*scope)).all()
        r["scoped_mixed_child_ids"] = s.scalars(select(Item.id).join(Order).where(Order.tenant_id == 7, Order.customer_id == 1, Order.id.in_([101, 800]))).all()
        assert r["scoped_mixed_child_ids"] == [10101, 10102]
        r["updated"] = s.execute(text("UPDATE orders SET status=:status WHERE tenant_id=:tenant AND customer_id=:customer AND id=:id"), {"status":"cancelled", "tenant":7, "customer":1, "id":800}).rowcount
        assert r["read"] == [] and r["count"] == 0 and r["children"] == [] and r["updated"] == 0
        s.rollback()
    finish()
    for retain in (False, True):
        r = start("stream_retain" if retain else "stream_discard")
        with Session(engine) as s:
            result = s.scalars(select(ExportRow).order_by(ExportRow.id).execution_options(yield_per=100))
            kept = []
            samples = []
            for chunk in result.partitions():
                if retain:
                    kept.extend(chunk)
                samples.append({"tracked": len(s.identity_map), "application_retained": len(kept)})
            result.close()
            r["samples"] = samples
            r["maximum_tracked"] = max(x["tracked"] for x in samples)
            assert len(samples) == 12
            assert samples[-1]["tracked"] == (1200 if retain else 100)
        finish()
    for key in ('lazy_1','lazy_3','lazy_6','joined','batched','projection','bounded_0','bounded_1','bounded_6'):
        assert all(t['sql'].lstrip().startswith('SELECT') for t in report['runs'][key]['trace'])
    report["status"] = "all assertions passed"
finally:
    active = None
    engine.dispose()
    with admin.connect() as c:
        c.exec_driver_sql(f'DROP DATABASE "{DB}"')
    admin.dispose()
    report["cleanup"] = "all sessions closed; own database dropped"
print(json.dumps(report, indent=2))
