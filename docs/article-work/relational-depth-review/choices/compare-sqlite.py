"""Observe a two-connection WAL snapshot in a private temporary database."""
import json
import pathlib
import sqlite3
import tempfile

with tempfile.TemporaryDirectory(prefix='staycurrent-contract-') as folder:
    path = pathlib.Path(folder) / 'orders.sqlite'
    a = sqlite3.connect(path, isolation_level=None, timeout=1)
    b = sqlite3.connect(path, isolation_level=None, timeout=1)
    try:
        assert a.execute('PRAGMA journal_mode=WAL').fetchone()[0] == 'wal'
        a.execute('CREATE TABLE orders (order_id INTEGER PRIMARY KEY)')
        a.execute('INSERT INTO orders VALUES (101)')
        a.execute('BEGIN')
        first = a.execute('SELECT count(*) FROM orders').fetchone()[0]
        b.execute('INSERT INTO orders VALUES (102)')
        second = a.execute('SELECT count(*) FROM orders').fetchone()[0]
        try:
            a.execute('INSERT INTO orders VALUES (103)')
            raise AssertionError('Old reader unexpectedly became a writer')
        except sqlite3.OperationalError as error:
            assert error.sqlite_errorcode == sqlite3.SQLITE_BUSY_SNAPSHOT
            promotion = {'code': error.sqlite_errorcode, 'name': error.sqlite_errorname}
        a.execute('ROLLBACK')
        after = a.execute('SELECT count(*) FROM orders').fetchone()[0]
        assert (first, second, after) == (1, 1, 2)
        evidence = {'version': sqlite3.sqlite_version, 'journal_mode': 'wal',
                    'shared_cache': False, 'first': first, 'otherWriterCommitted': True,
                    'second': second, 'readerWriteAttempt': promotion, 'afterRollback': after}
        pathlib.Path(__file__).with_name('sqlite-reads-observed.json').write_text(json.dumps(evidence, indent=2) + '\n')
        print(json.dumps(evidence, indent=2))
    finally:
        a.close()
        b.close()
