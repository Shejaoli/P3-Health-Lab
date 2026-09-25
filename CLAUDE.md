# Claude Handoff: P3 Health Lab VPS Deployment

This file is the deployment handoff for Claude AI. Read it before changing code,
database state, infrastructure, or deployment configuration.

The goal is to deploy the existing P3 Health Lab application to the user's own
VPS without losing public content, admin access, database records, or private
media protection.

Do not deploy, migrate data, rotate credentials, or make destructive changes
until the user has confirmed the target VPS, domain, database, media-storage
choice, and backup plan.

---

## 1. What this application is

P3 Health Lab is a public academic and environmental-health research laboratory
website. It contains:

- Public research, projects, people, publications, teaching, news, contact,
  opportunities, and HumekaNeza pages.
- A protected admin area for verified content records.
- A protected People-photo upload workflow at `/upload`.
- A PostgreSQL database accessed through Drizzle ORM.
- An Express API mounted under `/api`.
- A React/Vite static frontend.

The application is currently a pnpm monorepo. The repository was originally
configured for Replit artifact routing, but the target is a self-managed VPS.

---

## 2. Repository map

```text
/
├── artifacts/
│   ├── p3-health-lab/              # React/Vite public site and admin UI
│   │   ├── src/App.tsx             # Public routes and much of the page content
│   │   ├── src/admin/AdminApp.tsx  # Admin login, records, media, uploads
│   │   ├── src/index.css           # Site and admin styling
│   │   ├── public/                 # favicon, logo, static image, robots.txt
│   │   ├── vite.config.ts          # Vite build; requires PORT and BASE_PATH
│   │   └── dist/public/            # Production static output after build
│   └── api-server/                 # Express API
│       ├── src/app.ts              # Express middleware and /api mount
│       ├── src/index.ts            # PORT validation and server startup
│       ├── src/routes/health.ts    # GET /api/healthz
│       ├── src/routes/public.ts    # Public database-backed endpoints
│       ├── src/routes/admin.ts     # Protected CRUD, auth, and media endpoints
│       ├── src/lib/adminAuth.ts    # Session-cookie auth and password hashing
│       ├── src/lib/objectStorage.ts# Replit-specific signed object storage
│       └── dist/index.mjs          # API production bundle after build
├── lib/
│   ├── db/                         # PostgreSQL pool, Drizzle schema, db push
│   ├── api-spec/                   # OpenAPI source and Orval codegen
│   ├── api-client-react/           # Generated React Query client
│   └── api-zod/                    # Generated Zod contracts
├── attached_assets/                # Supplied images and source materials
├── scripts/                        # Workspace utility scripts
├── pnpm-workspace.yaml             # Workspace packages and dependency policy
├── pnpm-lock.yaml                  # Locked dependency graph
└── .replit                         # Replit-only modules/workflow/deployment config
```

Source-of-truth rules:

1. Database structure: `lib/db/src/schema/`.
2. HTTP contract: `lib/api-spec/openapi.yaml`.
3. Generated API clients and Zod schemas are outputs; do not hand-edit them.
4. Public frontend routes/content: `artifacts/p3-health-lab/src/App.tsx`.
5. Admin frontend: `artifacts/p3-health-lab/src/admin/AdminApp.tsx`.
6. Server routes: `artifacts/api-server/src/routes/`.

---

## 3. Frontend architecture

The frontend is a React 19 single-page application using Vite, Wouter, React
Query, Tailwind CSS tooling, and shared UI components.

### Public routes

```text
/
/research
/research-map
/projects
/people
/about
/publications
/news
/contact
/teaching
/humekaneza
/get-involved
```

### Protected routes

```text
/upload
/admin
/admin/login
/admin/dashboard
/admin/people
/admin/projects
/admin/news
/admin/media
/admin/research-areas
/admin/teaching
/admin/profile
```

Unauthenticated admin routes intentionally render an unavailable/not-found
style screen. This is expected behavior, not a missing route.

### Important content boundary

Not every public page is database-driven:

- Much of the public site is currently hardcoded in `src/App.tsx`.
- Public News, Teaching, Opportunities, Profile/contact data, and publication
  links use API/database calls.
- The public `/people` directory currently contains the existing roster in
  `App.tsx`, including the supplied static portrait imports.
- The admin `admin_people` table and `/admin/people` interface are a separate
  database-backed management workflow. Do not assume they automatically drive
  the hardcoded public `/people` page unless that integration is deliberately
  implemented and verified.

Preserve the roster and supplied content. Do not invent people, portraits,
research claims, publications, or contact details.

### Frontend production build

Vite requires both environment variables even for a build:

```bash
PORT=19746 BASE_PATH=/ \
  pnpm --filter @workspace/p3-health-lab run build
```

The output is:

```text
artifacts/p3-health-lab/dist/public/
```

The VPS should serve that directory as static files. Because Wouter is an SPA
router, the reverse proxy must serve `index.html` for unknown non-API paths.

Frontend API calls use same-origin relative URLs such as `/api/public/profile`
and `/api/admin/...`. Keep the frontend and API on the same public origin unless
the code is intentionally changed and CORS/cookie behavior is re-tested.

---

## 4. Backend architecture

The API is Express 5 and is mounted at `/api` in `src/app.ts`.

Runtime startup:

```bash
NODE_ENV=production PORT=8080 \
  node --enable-source-maps artifacts/api-server/dist/index.mjs
```

The API listens on the configured `PORT`. It does not serve the React frontend.

### Health check

```text
GET /api/healthz
Expected response: {"status":"ok"}
```

### Public database-backed API

```text
GET /api/public/publications
GET /api/public/profile
GET /api/public/news
GET /api/public/opportunities
GET /api/public/teaching
```

Public endpoints filter database content to published and non-archived records
where appropriate. They validate responses through generated Zod schemas.

### Protected admin API

Authentication:

```text
POST /api/admin/auth/login
GET  /api/admin/auth/session
POST /api/admin/auth/logout
POST /api/admin/auth/password
```

Protected CRUD resources:

```text
GET/POST   /api/admin/content/people
PATCH/DELETE /api/admin/content/people/:id
GET/POST   /api/admin/content/projects
PATCH/DELETE /api/admin/content/projects/:id
GET/POST   /api/admin/content/news
PATCH/DELETE /api/admin/content/news/:id
GET/POST   /api/admin/content/researchAreas
PATCH/DELETE /api/admin/content/researchAreas/:id
GET/POST   /api/admin/content/teaching
PATCH/DELETE /api/admin/content/teaching/:id
GET/POST   /api/admin/content/opportunities
PATCH/DELETE /api/admin/content/opportunities/:id
GET/POST   /api/admin/content/profile
PATCH/DELETE /api/admin/content/profile/:id
GET/POST   /api/admin/content/media
PATCH/DELETE /api/admin/content/media/:id
PATCH      /api/admin/people/:id/photo
```

Admin requests require:

- A valid `p3_admin_session` HttpOnly cookie.
- A live database with the admin tables.
- Same-origin protection for state-changing routes.
- HTTPS in production so the cookie's `Secure` flag works correctly.

---

## 5. Authentication behavior

Authentication is custom database-backed session-cookie authentication. It is
not Clerk, Replit Auth, or OAuth.

- Passwords are stored as salted `scrypt` hashes.
- Session tokens are random values; only their HMAC-SHA256 hashes are stored.
- Sessions last 8 hours.
- The cookie is `HttpOnly`, `SameSite=Lax`, and `Secure` when
  `NODE_ENV=production`.
- Login attempts are rate-limited in process memory: 10 attempts per IP in a
  15-minute window. This is not a distributed rate limiter.
- `ADMIN_PASSWORD` is used only to bootstrap the first admin if no admin exists.
- If any admin already exists and the configured `ADMIN_EMAIL` is not present,
  bootstrap does not create another admin.
- The admin password can be changed from the admin dashboard.

Do not print credentials or session secrets in logs. Do not commit an env file.
Use a root-readable, service-readable secret file or the VPS secret-management
method selected by the user.

On a fresh VPS, verify the bootstrap sequence deliberately:

1. Create the database and schema.
2. Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `SESSION_SECRET`.
3. Start the API once so the first login can bootstrap the admin.
4. Log in through the same public HTTPS origin.
5. Change the bootstrap password immediately if appropriate.
6. Remove or unset `ADMIN_PASSWORD` after the first admin exists.

Never run with the default email/password assumptions in production.

---

## 6. Database

Database: PostgreSQL, accessed through `pg` and Drizzle ORM.

Required connection variable:

```text
DATABASE_URL=postgresql://...
```

The current repository has a Drizzle schema but no conventional migration
directory. The available commands are:

```bash
pnpm --filter @workspace/db run push
pnpm --filter @workspace/db run push-force   # dangerous; do not use casually
```

`push` uses `drizzle-kit push` against `DATABASE_URL`. Before using it against
any existing production database:

- Take a verified PostgreSQL backup.
- Inspect the schema and data first.
- Review the generated schema diff.
- Confirm whether this is a new empty database or a migration of an existing
  database.
- Never use `push-force` without explicit user approval and a tested rollback
  plan.

Current tables include:

```text
admin_users
admin_sessions
admin_people
admin_projects
admin_news
admin_research_areas
admin_teaching_records
admin_profile_info
admin_media
admin_opportunities
```

Important media relationships:

- `admin_people.photo_media_id`
- `admin_projects.image_media_id`
- `admin_news.image_media_id`
- `admin_media.object_path`
- `admin_media.associated_type`
- `admin_media.associated_id`

Do not assume the Replit development database contains all current content.
The project has previously encountered an empty development database. A VPS
migration needs an explicit data export/import plan if database content must be
preserved.

---

## 7. Media and object storage: the main VPS migration issue

The current `artifacts/api-server/src/lib/objectStorage.ts` is Replit-specific.
It calls this local Replit sidecar:

```text
http://127.0.0.1:1106/object-storage/signed-object-url
```

It also expects:

```text
PRIVATE_OBJECT_DIR=/some/replit/object/path
```

`PRIVATE_OBJECT_DIR` is not a normal VPS filesystem path in the current code.
The Replit sidecar will not exist on the VPS.

Do not deploy the current object-storage adapter unchanged and do not make the
private media bucket publicly readable.

Before deployment, choose one of these compatible designs:

### Preferred: S3-compatible private storage

Use a private S3-compatible bucket, either:

- A managed S3-compatible provider, or
- MinIO running on the VPS with its data directory on persistent storage.

Replace the Replit sidecar signing implementation with an adapter that:

- Creates short-lived presigned PUT URLs for authenticated admin uploads.
- Verifies content type, size, and image magic bytes server-side.
- Creates short-lived presigned GET URLs for authenticated admin previews.
- Keeps the bucket private.
- Never logs access keys or signed URLs.
- Preserves the existing API workflow and database `objectPath` semantics as
  much as practical.

Expected VPS-side configuration will likely include names such as:

```text
S3_ENDPOINT=
S3_REGION=
S3_BUCKET=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_FORCE_PATH_STYLE=true|false
```

Use the storage provider's official SDK or a small, reviewed adapter. Do not
add credentials to the repository.

### Alternative: private local filesystem

This requires a deliberate API change because the browser currently uploads
directly to a signed URL. If chosen, the API must expose an authenticated
upload endpoint, enforce size/type/magic-byte validation, write outside the
public web root, and stream private previews through an authenticated route.
Do not place private media under the Nginx document root.

The supplied static portraits imported by Vite are different from admin media:
they are intentionally bundled into the public frontend build. Do not move
private admin uploads into the public bundle.

---

## 8. Replit-only assumptions that must not be copied to the VPS

The following are Replit mechanisms, not VPS deployment mechanisms:

- `.replit`
- `.replit-artifact/artifact.toml`
- Replit workflows
- Replit artifact path routing
- Replit's object-storage sidecar at `127.0.0.1:1106`
- `PRIVATE_OBJECT_DIR` in its current meaning
- `REPLIT_DEV_DOMAIN`
- `REPLIT_DOMAINS`
- Replit's automatic TLS and proxy
- Replit's deployment build/run settings

On a VPS:

- Nginx or Caddy must terminate TLS and reverse-proxy `/api`.
- A process manager or container orchestrator must keep the API running.
- PostgreSQL must be backed up and managed.
- Private media storage must be selected and configured.
- DNS and firewall rules must be configured by the user/provider.
- SPA fallback must be configured for direct frontend routes.

`requireSameOrigin` currently recognizes the request Host and Replit domains.
With frontend and API on one HTTPS origin, Host matching should work. If the
VPS uses separate domains or a proxy that changes Host, update the same-origin
configuration deliberately and test login, logout, password change, and every
state-changing admin route.

---

## 9. Recommended single-VPS shape

Do not assume this shape is approved; confirm with the user first.

```text
Internet
   |
   v
Nginx/Caddy :443
   |-- /api/*  -> 127.0.0.1:8080 -> Node Express API
   |-- /*      -> static files in artifacts/p3-health-lab/dist/public
   |
   +-- TLS certificates, security headers, request limits

PostgreSQL -> local service or managed database
Private media -> managed S3-compatible bucket or MinIO
```

If using Nginx, preserve the `/api` prefix when proxying:

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:8080;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 60s;
}

location / {
    try_files $uri $uri/ /index.html;
}
```

Do not use a trailing slash in `proxy_pass` unless you have verified that the
API still receives `/api/...`; the Express server mounts its router at `/api`.

The exact web server, service manager, firewall, and container choice must be
confirmed after inspecting the VPS. Do not install or remove system packages
without telling the user what will change.

---

## 10. Safe deployment workflow for Claude

Claude should follow this sequence and stop for confirmation at the marked
decision points.

### Phase A — inspect only

```bash
git status --short
git log -1 --oneline
node --version
pnpm --version
uname -a
cat /etc/os-release
df -h
free -h
ss -ltnp
```

Also inspect whether the VPS already has:

- Nginx or Caddy.
- A process manager or Docker.
- PostgreSQL or a remote PostgreSQL URL.
- A DNS record and TLS certificate.
- Another application using ports 80, 443, 8080, or the proposed database.
- A backup destination.

Do not expose or print existing secret values.

### Phase B — ask the user to confirm

Ask for decisions, not passwords in chat:

1. What domain should serve the app?
2. Is DNS already pointed to this VPS?
3. Should PostgreSQL run locally, or is there a managed PostgreSQL database?
4. Should private media use MinIO on this VPS or an external S3-compatible
   provider?
5. Should deployment use systemd + Nginx/Caddy or Docker Compose?
6. Is the current Replit database/content expected to be migrated?
7. What backup and rollback location is available?

The user can place secret values directly into a protected VPS env file or
secret manager. Never ask them to paste secrets into a public prompt, commit,
or log.

### Phase C — prepare without going live

1. Clone or update the repository in a dedicated release directory.
2. Install the selected Node and pnpm versions.
3. Run `pnpm install --frozen-lockfile`.
4. Add a protected production environment file.
5. Implement and test the VPS media adapter before enabling uploads.
6. Provision PostgreSQL and take/verify backups.
7. Apply the Drizzle schema only after reviewing the diff.
8. Build the frontend and API.
9. Start the API on loopback only.
10. Test `/api/healthz`, public endpoints, admin login, and protected routes
    before putting Nginx/Caddy in front.

### Phase D — go live

1. Configure DNS and HTTPS.
2. Configure the reverse proxy with `/api` preservation and SPA fallback.
3. Start the API with a process manager.
4. Verify from the public domain.
5. Verify direct navigation to `/people`, `/news`, `/teaching`, and
   `/get-involved`.
6. Verify anonymous access receives `401` for admin session/content/media APIs.
7. Verify authenticated admin login and logout.
8. Verify media upload, verification, association, preview, replace, and
   unlink.
9. Check logs for startup errors, database errors, storage errors, and cookie
   issues.
10. Record the release version, backup location, and rollback command.

---

## 11. Environment variable contract

Required for the API:

```text
NODE_ENV=production
PORT=8080
DATABASE_URL=postgresql://...
SESSION_SECRET=<long random secret>
```

Required for first admin bootstrap:

```text
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=<temporary strong password>
```

The API will run without `ADMIN_PASSWORD` after an admin exists. Remove the
bootstrap password from the long-term runtime environment after setup.

Required for frontend build:

```text
PORT=19746
BASE_PATH=/
```

Possible production logging:

```text
LOG_LEVEL=info
```

Storage variables depend on the confirmed VPS adapter. Do not set
`PRIVATE_OBJECT_DIR` on the VPS and assume it works without changing
`objectStorage.ts`.

---

## 12. Verification checklist

Run the repository checks before claiming success:

```bash
pnpm --filter @workspace/api-server run typecheck
pnpm --filter @workspace/api-server run build
PORT=19746 BASE_PATH=/ pnpm --filter @workspace/p3-health-lab run build
git diff --check
```

The current repository has a known frontend typecheck issue: the production
frontend build passes, but the frontend typecheck has previously reported that
generated API hooks are not consistently exposed through
`@workspace/api-client-react`, along with related implicit-any errors. Treat
this as an existing issue to investigate separately; do not hide it by
loosening TypeScript settings.

HTTP checks after startup:

```bash
curl -fsS https://YOUR_DOMAIN/api/healthz
curl -i https://YOUR_DOMAIN/api/admin/auth/session
curl -i https://YOUR_DOMAIN/api/admin/content/people
curl -fsS https://YOUR_DOMAIN/api/public/profile
curl -fsS https://YOUR_DOMAIN/api/public/news
```

Expected:

- Health: `200` and `{"status":"ok"}`.
- Anonymous admin session/content: `401`.
- Public endpoints: `200` when the database/schema is available.
- SPA routes: `200` HTML from the frontend.
- Direct route refreshes do not return Nginx `404`.

Do not call deployment complete until:

- HTTPS works.
- Admin cookies are Secure and survive normal same-origin requests.
- No private media is reachable without authorization.
- Database backup and restore procedures have been tested or explicitly
  accepted as pending by the user.

---

## 13. Rollback and incident rules

Before every production change:

- Record the current commit.
- Back up the database.
- Preserve the previous frontend build.
- Preserve the previous API build or container image.
- Record changed environment variables without recording their values.

If a deployment is broken:

1. Check service status and logs.
2. Check `/api/healthz`.
3. Check Nginx/Caddy routing.
4. Check database connectivity.
5. Check object-storage connectivity.
6. Roll back application code before attempting a destructive database change.
7. Never delete database rows or media to “fix” a deployment without explicit
   approval.

---

## 14. Copy-paste instruction for Claude AI

Use this as the first message to Claude after opening the repository on the
VPS:

```text
You are helping me deploy the existing P3 Health Lab application to my own
VPS. Read CLAUDE.md completely before doing anything.

Do not deploy immediately. First inspect the repository, VPS OS, Node/pnpm
versions, existing services, ports, DNS/TLS state, database state, backup
options, and available storage. Do not print or request secrets in chat.

The application is a pnpm monorepo with:
- React/Vite static frontend at artifacts/p3-health-lab
- Express API at artifacts/api-server
- PostgreSQL + Drizzle schema at lib/db
- OpenAPI source at lib/api-spec/openapi.yaml
- Generated React Query and Zod clients under lib/api-client-react and
  lib/api-zod

The public frontend must be built into
artifacts/p3-health-lab/dist/public and served with SPA fallback. The API must
run on loopback and be reverse-proxied under the same public /api path. The
API health endpoint is /api/healthz.

Important: the current media adapter uses a Replit-only object-storage
sidecar at 127.0.0.1:1106. Do not deploy it unchanged. Before enabling admin
uploads, propose and get approval for either a private S3-compatible/MinIO
adapter with presigned URLs or a secure private filesystem adapter.

Important: the custom admin auth uses PostgreSQL session records and the
p3_admin_session cookie. Preserve HttpOnly, SameSite=Lax, Secure in
production, same-origin protection, password hashing, and protected media
reads. Do not replace it with a different auth system without approval.

Important: some public content is hardcoded in App.tsx while News, Teaching,
Opportunities, Profile, and publication links are database-backed. The public
/people roster and the admin people table are not automatically the same data
source. Do not rewrite the public content model during deployment.

Before changing anything, present:
1. The VPS architecture you recommend.
2. The database and content migration plan.
3. The private media-storage plan.
4. The required environment variable names, without secret values.
5. The reverse-proxy plan.
6. The backup and rollback plan.
7. Any code changes required because of Replit-only assumptions.

Wait for my confirmation before installing packages, changing DNS, applying a
database schema, changing storage, creating services, or going live. After
approval, make the smallest safe changes, test each layer, and report exact
commands, files changed, verification results, and any remaining blocker.
```
