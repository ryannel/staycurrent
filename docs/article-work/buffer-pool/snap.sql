SELECT c.relname, count(*) AS buffers, round(avg(b.usagecount),1) AS avg_usage
FROM pg_buffercache b JOIN pg_class c ON b.relfilenode = pg_relation_filenode(c.oid)
 AND b.reldatabase = (SELECT oid FROM pg_database WHERE datname = current_database())
WHERE c.relname IN ('products','products_pkey','page_views','page_views_pkey')
GROUP BY 1 ORDER BY 1;
