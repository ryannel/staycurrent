# Owned index fixture startup

The first SQL attempt failed before test DDL because PostgreSQL reserves pg_-prefixed schema names; author preserved it as native-attempt-01 and renamed the private schema to sc_indexes_probe.

A subsequent fixture provision reached the image's temporary initialisation server and lost the connection as that server stopped. The helper removed that owned container and credentials. Readiness now requires PID1 to be the final postgres process as well as pg_isready, avoiding the temporary server. The following provision and complete inspected SQL run passed; its final fixture record/evidence identify that successful run. No existing database targeted.
