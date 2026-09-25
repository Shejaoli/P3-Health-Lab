---
name: Admin system maintenance
description: Security and generated-contract constraints for the P3 Health Lab admin system.
---

Admin media objects are private by default and must remain behind the server-side admin session; only verified image uploads should become media records.

**Why:** The admin is intentionally hidden from public navigation, but hidden routes are not security boundaries. Presigned storage URLs and object previews need separate authorization checks.

**How to apply:** Keep authentication and same-origin checks on every admin mutation and private object read. If public media is added later, expose only records explicitly marked public rather than the whole private object directory.

The API zod generator appends a wildcard export for generated types, which conflicts with generated runtime validators when an operation response shares a schema name such as `AdminSessionResponse`.

**Why:** Regenerating the OpenAPI clients can reintroduce a TypeScript duplicate-export error even when the API itself is valid.

**How to apply:** After codegen, keep the package entrypoint exporting generated runtime validators plus an explicit list of non-conflicting type names; run workspace library typechecking before changing API consumers.

Types inferred from `drizzle-zod` schemas should use `zod/v4`, even when the workspace's root `zod` dependency resolves to v3.

**Why:** `drizzle-zod` schema types and v3's `z.infer` are incompatible, producing a TypeScript constraint error on otherwise valid insert schemas.

**How to apply:** Import `z` from `zod/v4` wherever deriving types from `createInsertSchema(...)`; re-run workspace typechecking after changes.

The admin browser client uses credentialed requests, so the API must answer CORS preflights with an echoed origin and `Access-Control-Allow-Credentials: true`; wildcard CORS can surface as a generic browser “Failed to fetch.”

**Why:** JSON login is a preflighted POST, and browsers reject credentialed requests when the server responds with `Access-Control-Allow-Origin: *`.

**How to apply:** Preserve credentialed CORS handling when editing the API bootstrap, and keep trusted-origin checks on state-changing admin routes.