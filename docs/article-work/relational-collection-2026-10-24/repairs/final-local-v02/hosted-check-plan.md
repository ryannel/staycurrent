# Exact SQL check in isolated CI

Local PostgreSQL18.6 initdb cannot allocate its56byte interlock at the host32segment SysVlimit. No unprovenIPC/globalsetting removed. Official PG18source rulesout single-user as exactpsql substitute; private writer evidence/single-user-research.md retainsdetails.

Root adds manual-only .github/workflows/relational-sql-check.yml, using official postgres:18.6-bookworm job/service containers on disposable GitHubUbuntu runner. Readonly contentspermission, checkoutcredentialsnotpersisted, no publishjob/productioncredentials/externalDB. Per-run uniquely named database/taskuser plus server18.6/port checked in SAMEpsql session before exactcurrentdownload runs. Input/workflow SHA256 and versions logged, all assertions and printed expectedresults retained. Original local runner remains unsuccessful; hosted result mustbe identifiedas Linux/officialcontainer insteadof macOSrun.

Based on https://docs.github.com/en/actions/tutorials/use-containerized-services/create-postgresql-service-containers and https://hub.docker.com/_/postgres (official18.6-bookwormtagverified24October2026). This draftcheckpoint is pushedto enableexact CI;05native remains pending until actual success.
