SET statement_timeout='20s';
SHOW autocommit_before_ddl; SET autocommit_before_ddl=false; BEGIN; CREATE TABLE shop.allowed_migration(id INT); ROLLBACK;
