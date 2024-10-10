1. shell into postgres pod
2. run: `psql -U admin -d explorer_api` (and enter password)
3. run below command

```sql
SELECT 'DROP TABLE IF EXISTS "' || tablename || '" CASCADE;'
FROM pg_tables
WHERE schemaname = 'public';
```

4. copy the output and run it in the same psql session
5. run `DROP SCHEMA drizzle CASCADE;`
