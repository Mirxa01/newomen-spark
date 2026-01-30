SELECT proname, proargtypes::text[]
FROM pg_proc
WHERE proname = 'has_role';