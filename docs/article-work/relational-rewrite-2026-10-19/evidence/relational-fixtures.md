# Run each SQL fixture in its own database

The articles share tenant t4, customer 42 and workshop session s7 so the
decisions stay familiar. Their SQL fixtures are independent. A short example
keeps only the columns it needs; a later page's table is not a schema migration
to apply to an earlier page's database.

For the general SQL examples, use a fresh disposable PostgreSQL database
for each article. These statements assume a PostgreSQL installation and a role
permitted to create a local lab database. Choose a new name you own:

```sh
createdb staycurrent_keys_lab
psql -X -v ON_ERROR_STOP=1 -d staycurrent_keys_lab
```

Paste the chosen article's setup before its queries. Expected failures belong
to the lesson: inspect the SQLSTATE, roll back an aborted explicit transaction,
then continue from the stated next step. A failure does not mean later commands
have run. Close the connection and remove only your named disposable database
when finished:

```sh
dropdb staycurrent_keys_lab
```

Choose a different fresh name for the next article. Do not run these fixtures
inside an application's database. SQLite examples use their own in-memory
database and are labelled separately; PostgreSQL and SQLite syntax is not
interchangeable.

For the operating lessons, use their supplied native worksheets. Those initialise
isolated clusters, own their ports and temporary directories, and stop their own
servers. Their version and dependency notes accompany the evidence. An existing
shared server cannot reproduce a crash, replica or restore lesson safely merely
by adding a schema.
