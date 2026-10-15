#!/usr/bin/env python3
"""Disposable PostgreSQL 18 physical-recovery experiment (macOS/Linux).

Requires Python 3 and PostgreSQL 18 server/client tools on PATH, or PG_BINDIR.
Creates fresh private clusters, listens only on their private Unix socket, and
stops them in finally. It never connects to an existing database. Retains files
and observations for inspection; prints the directory to remove when finished.
This small local experiment does not measure production recovery time or test
off-site storage, credentials, extensions, or a complete application restore.
"""
import json
import os
from pathlib import Path
import re
import shlex
import shutil
import subprocess
import tempfile
import time

bindir = os.environ.get("PG_BINDIR", "")
def tool(name):
    path = str(Path(bindir) / name) if bindir else shutil.which(name)
    if not path:
        raise RuntimeError(f"Missing {name}; install PostgreSQL 18 or set PG_BINDIR")
    return path

def run(name, *args, check=True):
    result = subprocess.run([tool(name), *map(str, args)], text=True,
                            capture_output=True, check=False, timeout=90)
    if check and result.returncode:
        raise RuntimeError(f"{name} failed: {result.stdout}{result.stderr}")
    return result

version = run("postgres", "--version").stdout.strip()
if not re.search(r"PostgreSQL\) 18\.", version):
    raise RuntimeError(f"This exercise requires PostgreSQL 18: {version}")

root = Path(tempfile.mkdtemp(prefix="sc-physical-restore-"))
root.chmod(0o700)
socket = root / "socket"
socket.mkdir()
archive = root / "archive"
archive.mkdir()
source, base = root / "source", root / "base"
target, incomplete = root / "recovered", root / "missing-wal"
report = {"version": version, "directory": str(root)}
started = []
print(f"Experiment files: {root}", flush=True)

def setting(name, value):
    return name + " = '" + str(value).replace("\\", "\\\\").replace("'", "''") + "'\n"

def sql(port, command, db="shop"):
    return run("psql", "-XAt", "--set=ON_ERROR_STOP=1", "-h", socket,
               "-p", port, "-d", db, "-c", command).stdout.strip()

def rows(port):
    return json.loads(sql(port, "SELECT coalesce(json_agg(o ORDER BY order_id),'[]') FROM orders o"))

def start(directory):
    # Register before attempting startup so failure cleanup also checks this path.
    started.append(directory)
    return run("pg_ctl", "-D", directory, "-l", root / (directory.name + ".log"),
               "-w", "-t", "30", "start", check=False)

def stop(directory):
    if (directory / "postmaster.pid").exists():
        run("pg_ctl", "-D", directory, "-w", "-t", "30", "stop", "-m", "fast")

def wait_for(predicate, description):
    end = time.monotonic() + 30
    while time.monotonic() < end:
        if predicate():
            return
        time.sleep(0.05)
    raise RuntimeError("Timed out: " + description)

def recovered_config(directory, archive_path, port):
    shutil.copytree(base, directory)
    # The copied base remains untouched. Settings here belong only to this target.
    with (directory / "postgresql.conf").open("a") as f:
        f.write(setting("port", port) + setting("archive_mode", "off"))
        f.write(setting("restore_command", "cp " + shlex.quote(str(archive_path / "%f")) + " '%p'"))
        f.write(setting("recovery_target_name", "before_mistake"))
        f.write(setting("recovery_target_action", "pause"))
    (directory / "recovery.signal").touch()

try:
    run("initdb", "-D", source, "--auth-local=trust", "--auth-host=reject",
        "--encoding=UTF8", "--locale=C")
    dest = shlex.quote(str(archive / "%f"))
    archive_command = f"if test -f {dest}; then cmp -s '%p' {dest}; else cp '%p' {dest}; fi"
    with (source / "postgresql.conf").open("a") as f:
        for name, value in {"listen_addresses": "", "unix_socket_directories": socket,
                            "port": 55440, "wal_level": "replica", "archive_mode": "on",
                            "archive_command": archive_command, "max_wal_senders": 5}.items():
            f.write(setting(name, value))
    result = start(source)
    if result.returncode:
        raise RuntimeError((root / "source.log").read_text())
    run("createdb", "-h", socket, "-p", "55440", "shop")
    sql(55440, "CREATE TABLE orders(order_id integer PRIMARY KEY, request_key text UNIQUE NOT NULL, amount numeric(10,2) NOT NULL); INSERT INTO orders VALUES(101,'req-a',25)")
    report["before_base"] = rows(55440)
    run("pg_basebackup", "-h", socket, "-p", "55440", "-D", base,
        "--wal-method=stream", "--checkpoint=fast")
    report["base_verification"] = run("pg_verifybackup", base).stdout.strip()
    # Put the later changes in WAL beyond the backup's included stream.
    sql(55440, "SELECT pg_switch_wal()")
    sql(55440, "INSERT INTO orders VALUES(102,'req-b',8)")
    point = sql(55440, "SELECT pg_create_restore_point('before_mistake')")
    segment = sql(55440, f"SELECT pg_walfile_name('{point}'::pg_lsn)")
    report["target"] = {"name": "before_mistake", "lsn": point, "wal_segment": segment}
    report["at_target"] = rows(55440)
    sql(55440, "DELETE FROM orders WHERE request_key='req-a'")
    sql(55440, "INSERT INTO orders VALUES(103,'req-c',12)")
    report["after_mistake_and_later_purchase"] = rows(55440)
    sql(55440, "SELECT pg_switch_wal()")
    wait_for(lambda: sql(55440, f"SELECT coalesce(last_archived_wal >= '{segment}',false) FROM pg_stat_archiver") == "t", "target WAL archived")
    report["acknowledged_requests"] = ["req-a", "req-b", "req-c"]
    stop(source)

    recovery_started = time.monotonic()
    recovered_config(target, archive, 55441)
    result = start(target)
    if result.returncode:
        raise RuntimeError((root / "recovered.log").read_text())
    wait_for(lambda: sql(55441, "SELECT pg_is_wal_replay_paused()") == "t", "pause at restore point")
    report["recovered"] = rows(55441)
    report["paused_read_only"] = sql(55441, "SHOW transaction_read_only")
    assert report["recovered"] == report["at_target"]
    assert report["paused_read_only"] == "on"
    report["missing_acknowledgements"] = json.loads(sql(55441, "WITH receipts(request_key,expected_amount) AS (VALUES ('req-a',25),('req-b',8),('req-c',12)) SELECT json_agg(x) FROM (SELECT r.*,o.amount AS recovered_amount FROM receipts r LEFT JOIN orders o USING(request_key) WHERE o.request_key IS NULL OR o.amount IS DISTINCT FROM r.expected_amount) x"))
    assert report["missing_acknowledgements"] == [{"request_key": "req-c", "expected_amount": 12, "recovered_amount": None}]
    report["local_target_copy_start_and_sql_checks_seconds"] = round(time.monotonic() - recovery_started, 3)
    stop(target)

    # Same valid base; archive now ends before the requested target. Do not alter
    # the real archive or silently choose a different recovery objective.
    partial_archive = root / "incomplete-archive"
    partial_archive.mkdir()
    for path in archive.iterdir():
        if re.fullmatch(r"[0-9A-F]{24}", path.name) and path.name < segment:
            shutil.copy2(path, partial_archive / path.name)
    recovered_config(incomplete, partial_archive, 55442)
    result = start(incomplete)
    failure_message = "recovery ended before configured recovery target was reached"
    # Hot standby can briefly accept connections before exhausting the archive.
    # pg_ctl readiness alone therefore cannot establish target completion.
    wait_for(lambda: failure_message in (root / "missing-wal.log").read_text()
             and not (incomplete / "postmaster.pid").exists(),
             "unreached-target failure and server shutdown")
    report["missing_wal_attempt"] = {"initial_pg_ctl_exit": result.returncode,
        "server_stopped": True, "target_reached": False,
        "message": "recovery ended before configured recovery target was reached",
        "base_still_verifies": run("pg_verifybackup", base).stdout.strip()}
    (root / "observed.json").write_text(json.dumps(report, indent=2) + "\n")
    print(json.dumps(report, indent=2), flush=True)
finally:
    cleanup_errors = []
    for directory in reversed(started):
        try:
            stop(directory)
        except Exception as error:
            cleanup_errors.append(f"{directory}: {error}")
    if cleanup_errors:
        raise RuntimeError("Cleanup could not confirm every server stopped; inspect these paths:\n"
                           + "\n".join(cleanup_errors))
    print(f"All experiment servers stopped. Files retained at {root}", flush=True)
