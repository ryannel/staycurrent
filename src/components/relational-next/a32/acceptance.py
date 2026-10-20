#!/usr/bin/env python3
"""Disposable SQLite acceptance worksheet. Python >=3.12; standard library only.
Requires loaded SQLite >=3.37 with STRICT, WAL and JSON support. Review the
SQLite release's WAL fixes before running on an intended deployment.

Run: python3 acceptance.py > sqlite-evidence.json
Uses a private temporary directory; never opens an existing database. Spawns only
this script with the same interpreter. Removes all databases on exit. SIGKILL is
a process-failure test, not a power-loss test. max_page_count simulates a database
page budget, not a full physical disk. Run on the intended local volume separately
before making deployment claims. No throughput or production latency benchmark.
"""
import json
import os
import pathlib
import platform
import sqlite3
import subprocess
import sys
import tempfile
import time


def connect(path):
    c = sqlite3.connect(path, autocommit=True, timeout=0.08)
    c.execute("PRAGMA foreign_keys=ON")
    c.execute("PRAGMA synchronous=FULL")
    c.execute("PRAGMA busy_timeout=80")
    return c


def settings(c):
    return {p: c.execute("PRAGMA " + p).fetchone()[0] for p in
            ("journal_mode", "synchronous", "foreign_keys", "busy_timeout",
             "wal_autocheckpoint", "page_size", "fullfsync", "checkpoint_fullfsync")}


def error_case(c, sql, args=()):
    started = time.perf_counter()
    try:
        c.execute(sql, args).close()
    except (sqlite3.Error, OverflowError) as e:
        return {"error": getattr(e, "sqlite_errorname", type(e).__name__),
                "code": getattr(e, "sqlite_errorcode", None),
                "ms": round((time.perf_counter()-started)*1000, 3),
                "in_transaction": c.in_transaction}
    raise AssertionError("Expected rejection: " + sql)


def child():
    path, mode = sys.argv[2:4]
    c = connect(path)
    if mode == "busy":
        print(json.dumps(error_case(c, "BEGIN IMMEDIATE")), flush=True)
        c.close()
        return
    if mode == "release":
        c.execute("BEGIN IMMEDIATE")
        print("ready", flush=True)
        assert sys.stdin.readline().strip() == "release"
        c.execute("COMMIT")
        c.close()
        return
    c.execute("BEGIN IMMEDIATE")
    c.execute("INSERT INTO events VALUES ('uncommitted')")
    print("ready", flush=True)
    # Parent kills this exact process only, after observing readiness.
    sys.stdin.readline()


def start_child(path, mode):
    return subprocess.Popen([sys.executable, __file__, "--child", str(path), mode],
                            stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                            stderr=subprocess.PIPE, text=True)


def main():
    out = {"observed_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
           "python": sys.version, "executable": sys.executable,
           "sqlite": sqlite3.sqlite_version, "threadsafety": sqlite3.threadsafety,
           "platform": platform.platform(), "scope": "small local acceptance checks"}
    with tempfile.TemporaryDirectory(prefix="staycurrent-a32-") as directory:
        root = pathlib.Path(directory)
        out["directory_mode"] = oct(root.stat().st_mode & 0o777)
        c = connect(root / "shop.db")
        out["source_id"] = c.execute("SELECT sqlite_source_id()").fetchone()[0]
        out["compile_options"] = [r[0] for r in c.execute("PRAGMA compile_options")]
        assert c.execute("PRAGMA journal_mode=WAL").fetchone()[0] == "wal"
        c.executescript("""
          CREATE TABLE inventory(sku TEXT PRIMARY KEY, available INTEGER NOT NULL
            CHECK(available>=0)) STRICT;
          CREATE TABLE reservations(request_id TEXT PRIMARY KEY,
            sku TEXT NOT NULL REFERENCES inventory(sku),
            cents INTEGER NOT NULL CHECK(cents>0), placed TEXT NOT NULL,
            note TEXT) STRICT;
          INSERT INTO inventory VALUES('P7',7);
          CREATE TABLE events(value TEXT NOT NULL) STRICT;
          INSERT INTO events VALUES('acknowledged');
        """)
        d = connect(root / "shop.db")
        out["settings_c"] = settings(c)
        out["settings_new_d"] = settings(d)
        assert settings(d)["foreign_keys"] == 1
        out["new_connection_fk_rejection"] = error_case(d, "INSERT INTO reservations VALUES(?,?,?,?,?)",
            ("bad-d", "missing", 2000, "2026-10-20T12:00:00Z", None))
        failures = {}
        for name, sql, args in [
          ("negative", "UPDATE inventory SET available=-1", ()),
          ("foreign_key", "INSERT INTO reservations VALUES(?,?,?,?,?)",
           ("bad", "missing", 2000, "2026-10-20T12:00:00Z", None)),
          ("null", "INSERT INTO reservations VALUES(?,?,?,?,?)",
           ("bad", "P7", None, "2026-10-20T12:00:00Z", None)),
          ("strict", "INSERT INTO reservations VALUES(?,?,?,?,?)",
           ("bad", "P7", "twenty", "2026-10-20T12:00:00Z", None)),
        ]:
            failures[name] = error_case(c, sql, args)
        c.execute("BEGIN IMMEDIATE")
        c.execute("UPDATE inventory SET available=available-1 WHERE sku=? AND available>0", ("P7",))
        c.execute("INSERT INTO reservations VALUES(?,?,?,?,?)",
                  ("R1", "P7", 2000, "2026-10-20T12:00:00Z", None))
        c.execute("COMMIT")
        c.execute("BEGIN IMMEDIATE")
        c.execute("UPDATE inventory SET available=available-1 WHERE sku='P7'")
        failures["duplicate"] = error_case(c, "INSERT INTO reservations VALUES(?,?,?,?,?)",
                            ("R1", "P7", 2000, "2026-10-20T12:00:00Z", None))
        # Default constraint failure aborts the statement, not earlier work.
        out["after_duplicate_before_rollback"] = c.execute("SELECT available FROM inventory").fetchone()[0]
        c.execute("ROLLBACK")
        out["after_duplicate_rollback"] = c.execute("SELECT available FROM inventory").fetchone()[0]
        assert out["after_duplicate_rollback"] == 6
        out["constraints"] = failures
        out["strict_numeric_text"] = c.execute("SELECT CAST(? AS INTEGER)", ("2000",)).fetchone()[0]
        c.execute("CREATE TEMP TABLE coercion(cents INTEGER) STRICT")
        c.execute("INSERT INTO coercion VALUES(?)", ("2000",))
        out["strict_coercion"] = c.execute("SELECT cents, typeof(cents) FROM coercion").fetchall()
        legacy = sqlite3.connect(":memory:")
        legacy.execute("CREATE TABLE t(v INTEGER)")
        legacy.execute("SELECT * FROM t").fetchall()
        before = legacy.in_transaction
        legacy.execute("INSERT INTO t VALUES(1)")
        out["legacy_driver_transactions"] = {"after_select": before, "after_insert": legacy.in_transaction,
            "autocommit_is_legacy": legacy.autocommit == sqlite3.LEGACY_TRANSACTION_CONTROL}
        legacy.rollback(); legacy.close()
        out["values"] = {"reservation": c.execute("SELECT * FROM reservations").fetchall(),
          "int64": c.execute("SELECT ?", (2**63-1,)).fetchone()[0],
          "integer_overflow": error_case(c, "SELECT ?", (2**63,)),
          "nocase_ascii_unicode": c.execute("SELECT 'A'='a' COLLATE NOCASE, 'Æ'='æ' COLLATE NOCASE").fetchone(),
          "json": c.execute("SELECT json_extract(?, '$.sku')", ('{"sku":"P7"}',)).fetchone()[0]}
        c.execute("BEGIN IMMEDIATE")
        out["two_connections_busy"] = error_case(d, "BEGIN IMMEDIATE")
        p = start_child(root / "shop.db", "busy")
        try:
            stdout, stderr = p.communicate(timeout=5)
            assert p.returncode == 0, stderr
            out["two_processes_busy"] = json.loads(stdout)
        finally:
            if p.poll() is None:
                p.kill(); p.communicate(timeout=5)
        c.execute("ROLLBACK")
        d.execute("BEGIN IMMEDIATE"); d.execute("COMMIT")
        out["write_after_release"] = "success"
        # A child holds the writer until told to release. Parent's bounded busy
        # wait succeeds; the release comes from a timer on a pipe, not a shared connection.
        import threading
        p = start_child(root / "shop.db", "release")
        try:
            assert p.stdout.readline().strip() == "ready"
            def release():
                p.stdin.write("release\n"); p.stdin.flush()
            timer = threading.Timer(0.04, release)
            timer.start()
            c.execute("PRAGMA busy_timeout=1000")
            started = time.perf_counter()
            c.execute("BEGIN IMMEDIATE"); c.execute("COMMIT")
            out["wait_then_success_ms"] = round((time.perf_counter()-started)*1000, 3)
            timer.join(timeout=2)
            stdout, stderr = p.communicate(timeout=5)
            assert p.returncode == 0, stderr
        finally:
            if p.poll() is None:
                p.kill(); p.communicate(timeout=5)
            c.execute("PRAGMA busy_timeout=80")
        d.execute("BEGIN")
        out["snapshot_before"] = d.execute("SELECT available FROM inventory").fetchone()[0]
        c.execute("UPDATE inventory SET available=5 WHERE sku='P7'")
        out["snapshot_after_other_commit"] = d.execute("SELECT available FROM inventory").fetchone()[0]
        out["stale_snapshot_write"] = error_case(d, "UPDATE inventory SET available=4 WHERE sku='P7'")
        d.execute("ROLLBACK")
        # Make the stock invariant true again for the recovery comparison.
        c.execute("UPDATE inventory SET available=6 WHERE sku='P7'")
        c.execute("PRAGMA wal_checkpoint(TRUNCATE)")
        c.execute("PRAGMA wal_autocheckpoint=0")
        d.execute("BEGIN")
        d.execute("SELECT * FROM events").fetchall()
        for i in range(8):
            c.execute("INSERT INTO events VALUES(?)", (f"log-{i}",))
        out["checkpoint_reader_open"] = c.execute("PRAGMA wal_checkpoint(PASSIVE)").fetchone()
        out["wal_bytes_reader_open"] = (root / "shop.db-wal").stat().st_size
        d.execute("ROLLBACK")
        out["checkpoint_reader_closed"] = c.execute("PRAGMA wal_checkpoint(TRUNCATE)").fetchone()
        out["wal_bytes_reader_closed"] = (root / "shop.db-wal").stat().st_size
        c.execute("PRAGMA wal_autocheckpoint=1000")
        # Supported backup API, reopen the independent destination and compare.
        backup = connect(root / "backup.db")
        started = time.perf_counter()
        c.backup(backup)
        backup.close()
        restored = connect(root / "backup.db")
        assert restored.execute("SELECT * FROM reservations ORDER BY request_id").fetchall() == c.execute("SELECT * FROM reservations ORDER BY request_id").fetchall()
        assert restored.execute("SELECT * FROM inventory").fetchall() == [("P7", 6)]
        assert restored.execute("PRAGMA integrity_check").fetchall() == [("ok",)]
        assert restored.execute("PRAGMA foreign_key_check").fetchall() == []
        out["backup_and_reopen_validation_ms"] = round((time.perf_counter()-started)*1000, 3)
        out["restore"] = {"inventory": restored.execute("SELECT * FROM inventory").fetchall(),
            "reservations": restored.execute("SELECT * FROM reservations").fetchall(),
            "events": restored.execute("SELECT count(*) FROM events").fetchone()[0],
            "integrity_check": "ok", "foreign_key_check": []}
        restored.close()
        d.close(); c.close()
        p = start_child(root / "shop.db", "kill")
        try:
            assert p.stdout.readline().strip() == "ready"
            p.kill(); p.communicate(timeout=5)
        finally:
            if p.poll() is None:
                p.kill(); p.communicate(timeout=5)
        c = connect(root / "shop.db")
        out["after_kill"] = {"events": c.execute("SELECT value FROM events ORDER BY value").fetchall(),
                             "settings": settings(c), "integrity": c.execute("PRAGMA integrity_check").fetchone()[0]}
        assert c.execute("SELECT count(*) FROM events WHERE value='uncommitted'").fetchone()[0] == 0
        c.execute("BEGIN IMMEDIATE")
        c.execute("ALTER TABLE reservations ADD COLUMN status TEXT NOT NULL DEFAULT 'held'")
        c.execute("PRAGMA user_version=1")
        c.execute("COMMIT")
        out["schema_change"] = c.execute("SELECT request_id,status FROM reservations").fetchall()
        c.close()
        reopened = connect(root / "shop.db")
        out["schema_after_reopen"] = {"rows": reopened.execute("SELECT request_id,status FROM reservations").fetchall(),
                                      "user_version": reopened.execute("PRAGMA user_version").fetchone()[0]}
        reopened.close()
        readonly = sqlite3.connect((root / "shop.db").as_uri()+"?mode=ro", uri=True, autocommit=True)
        out["readonly_write"] = error_case(readonly, "INSERT INTO events VALUES('forbidden')")
        readonly.close()
        full = connect(root / "limited.db")
        full.execute("CREATE TABLE payload(value BLOB) STRICT")
        pages = full.execute("PRAGMA page_count").fetchone()[0]
        full.execute(f"PRAGMA max_page_count={pages+2}")
        full.execute("BEGIN IMMEDIATE")
        out["page_budget_full"] = error_case(full, "INSERT INTO payload VALUES(zeroblob(65536))")
        if full.in_transaction:
            full.execute("ROLLBACK")
        out["full_recovery"] = {"rows": full.execute("SELECT count(*) FROM payload").fetchone()[0],
                                "integrity": full.execute("PRAGMA integrity_check").fetchone()[0]}
        full.close()
        # Rollback-journal reader prevents this writer's commit, unlike WAL.
        a = connect(root / "rollback.db")
        a.execute("CREATE TABLE t(v INTEGER)"); a.execute("INSERT INTO t VALUES(1)")
        b = connect(root / "rollback.db")
        b.execute("BEGIN"); b.execute("SELECT * FROM t").fetchall()
        a.execute("BEGIN IMMEDIATE"); a.execute("UPDATE t SET v=2")
        out["rollback_reader_commit"] = error_case(a, "COMMIT")
        b.execute("ROLLBACK"); a.execute("COMMIT")
        out["rollback_commit_after_reader"] = a.execute("SELECT v FROM t").fetchone()[0]
        a.close(); b.close()
    out["cleanup"] = "temporary directory removed; every child reaped; every connection closed"
    print(json.dumps(out, indent=2))


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--child":
        child()
    else:
        main()
