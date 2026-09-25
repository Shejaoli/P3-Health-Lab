---
name: Development database setup
description: Development database state required for validating database-backed API routes
---

The provisioned development PostgreSQL database can be reachable but have no application tables until the existing Drizzle schema is pushed.

**Why:** API routes that query admin-managed tables return relation-not-found errors even when the application and database connection are otherwise healthy.

**How to apply:** Before validating database-backed routes in development, check the public schema and use the project-documented dev-only schema push flow when it is empty. Do not apply this to production through ad hoc SQL.