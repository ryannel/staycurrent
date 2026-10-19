# Planning source checks

Read 19 October 2026. These checks constrain the plan; no procedures have been
executed and no teaching prose or production runbooks are claimed complete.

- PostgreSQL 18 continuous archiving:
  https://www.postgresql.org/docs/18/continuous-archiving.html
  Physical backups plus a continuous archive underpin PITR; configuration needs
  separate protection, and archiving failure can cause local log growth. This
  supports separate restore validation, log continuity and storage-pressure paths.
- PostgreSQL 18 row security:
  https://www.postgresql.org/docs/18/ddl-rowsecurity.html
  Tenant isolation must test owners and privileged/bypass roles, not only normal
  application queries.
- PostgreSQL 18 CREATE FUNCTION:
  https://www.postgresql.org/docs/18/sql-createfunction.html
  Function execution authority and object resolution require explicit security
  treatment rather than assuming the caller's object permissions settle access.
- PostgreSQL 18 resource consumption:
  https://www.postgresql.org/docs/18/runtime-config-resource.html
  Resource limits have different scopes; concurrency and operation multiplicity
  matter when budgeting memory.
- PostgreSQL 18 upgrading:
  https://www.postgresql.org/docs/18/upgrading.html
  Version changes need an explicit compatible migration method, downtime model
  and recovery route; downgrading is not assumed to be a configuration reversal.

The writer must pin the executable environment and consult version-specific
engine/provider documentation before supplying commands, timings or provider
promises. No existing relational corpus or old planning files were consulted.
