---
name: Development database setup
description: Development database state required for validating database-backed API routes
---

The provisioned development PostgreSQL database can be reachable but have no application tables until the existing Drizzle schema is pushed. Recheck its current state before reacting to an older enum/dependency error: a normal Drizzle push succeeded against an empty dev database.

**Why:** API routes that query admin-managed tables return relation-not-found errors even when the application and database connection are otherwise healthy; an empty schema needs creation, not a force push.

**How to apply:** Before validating database-backed routes in development, inspect relations and enums, then use the project-documented normal dev-only schema push if it is empty. If that push still conflicts, stop and report the blocker; never use force or apply this to production through ad hoc SQL.