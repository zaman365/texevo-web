# Cloudflare preview deployment

Deploy `main` to the `texevo-web` Worker in the TEXEVO Cloudflare account configured in `wrangler.jsonc`. The separate `codex/texevo-studio-experience` redesign is not part of this deployment. Keep `SITE_MODE=preview`: pending details and labelled examples remain visible, pages stay noindex, and external enquiry delivery/newsletters stay disabled.

## Provisioning status

As of 6 October 2026, hosting has **not** been deployed yet. The private Tigris bucket `texevo-private-uploads` has been created in Frankfurt (`fra`), using Standard storage and no payment method. Its bucket-scoped application key is created and verified; adding its secrets to the hosted Worker and the Neon sign-in are still pending. The `texevo.de` zone is active in Cloudflare; its existing origin records have not been changed.

Before deployment, create a separate preview PostgreSQL database (Neon, AWS Frankfurt, PostgreSQL 17) and a Hyperdrive configuration for that database. Do not reuse local development credentials or an unrelated Cloudflare account. R2 is not used; its subscription was not activated.

Add real resource bindings to `wrangler.jsonc` after provisioning:

- `HYPERDRIVE`: the new Hyperdrive configuration ID. Disable query caching for current enquiry, role and CMS state.
- `ASSETS` and `WORKER_SELF_REFERENCE` are already configured.

Missing database bindings or storage credentials fail closed. They never fall back to local PostgreSQL or an ephemeral filesystem on Workers. Hyperdrive maintains the upstream database pool; application connections use `maxUses: 1` because Workers cannot reuse a socket across requests.

Set these **runtime secrets** on the Worker: `PAYLOAD_SECRET` (at least 32 random characters), `ADMIN_GATE_USER`, `ADMIN_GATE_PASSWORD`, `S3_ACCESS_KEY_ID`, and `S3_SECRET_ACCESS_KEY`. Generate deployment-specific values and keep them out of Git, build logs and chat. Seed administrator credentials are only needed by the one-time seed job. Database credentials belong in Hyperdrive; they do not need to be plain Worker environment variables.

## Private uploads on Tigris

The non-secret storage settings in `wrangler.jsonc` select `https://t3.storage.dev`, signing region `auto`, virtual-hosted addressing (`S3_FORCE_PATH_STYLE=false`) and the private bucket. The bucket's data location is Frankfurt; the SDK's `auto` signing region does not change that location.

Use a bucket-scoped read/write key named `texevo-cloudflare-preview`, without bucket administration or access to future buckets. The application uploads, reads and deletes objects through the S3 API using a fetch transport compatible with Workers. Keys stay server-side. The existing scan quarantine and staff authorization still control downloads; no public URLs or browser-facing S3 credentials are introduced.

[Tigris's free tier](https://www.tigrisdata.com/pricing/) includes 5 GB Standard storage, 10,000 Class A and 100,000 Class B requests per month. No payment method was added. Usage beyond the free allowance can interrupt service; do not enable billing or paid features without approval. Keep snapshot and soft-delete retention disabled for this empty preview bucket to avoid retaining additional billed copies.

## Database initialization

Use the new database's direct TLS connection for migrations, outside Workers. In an isolated release checkout, create an ignored, private `.env` containing the new database connection, preview mode, Payload secret and temporary seed administrator credentials. Do not use the developer checkout's `.env`.

```sh
pnpm db:migrate
NODE_ENV=production pnpm cms:migrate
NODE_ENV=production pnpm seed
```

Seeding creates 63 unpublished editorial drafts and the initial administrator. Run it only against the new preview database. The schema lives in `db/001-initial.sql` and `src/migrations`; do not use development schema push for the hosted database.

## Build and publish

Use Node 22 and the pinned pnpm version. Configure Cloudflare Workers Builds for repository `zaman365/texevo-web`, production branch `main`, root `/`:

| Setting             | Value                                                                                                   |
| ------------------- | ------------------------------------------------------------------------------------------------------- |
| Build command       | `pnpm run build:cloudflare`                                                                             |
| Deploy command      | `pnpm run deploy:cloudflare`                                                                            |
| Other branch builds | Disabled until separate resources are provisioned                                                       |
| Build environment   | `SITE_MODE=preview`, `SITE_URL=https://texevo.de`, a non-secret build-only `PAYLOAD_SECRET` placeholder |

Build from a clean checkout without `.env` or `.env.local`. OpenNext can include dotenv file contents in its server environment module. Provision secrets at runtime, not in dotenv files in the build checkout. A clean build has empty environment maps in `.open-next/cloudflare/next-env.mjs`.

`open-next.config.ts` uses the supported webpack build for Cloudflare because Payload migration dependencies produce external dependency names that cannot be resolved by the Workers bundler after a Turbopack build. The regular local Next build is unchanged.

```sh
pnpm install --frozen-lockfile
pnpm build:cloudflare
pnpm exec wrangler deploy --dry-run
# Only after verifying the target account, bindings and secrets:
pnpm deploy:cloudflare
```

The measured bundle is about 18.9 MiB uncompressed. Cloudflare's [current Workers size limit](https://developers.cloudflare.com/workers/platform/limits/#worker-size) is 64 MiB on Free and Paid. Free still has a 10 ms CPU limit per request, so validate CMS, authentication and form operations on the deployed runtime before routing the domain. A local emulator cannot establish that the free CPU allowance is sufficient.

Publish to the Worker URL first. Verify health, assets, database operations, staff gates and form origins before directing `texevo.de` to it. `SITE_URL` must match the origin used for submissions. Do not switch DNS to an unhealthy deployment. Keep the original DNS values available for rollback and record the deployed commit/version. Protect the review deployment with an access policy; noindex does not restrict access.

## Validation

On 6 October 2026, strict TypeScript checking, 16 unit checks, the OpenNext build, Wrangler's deployment dry run and all 10 browser checks passed after switching to Tigris. A real Tigris connection check verified signed upload/read/delete and rejection of anonymous reads. Browser checks ran against the local Workers runtime with the actual private Tigris bucket and isolated local PostgreSQL through a local Hyperdrive binding. They covered responsive menus, routes, search, enquiry persistence/retries, concurrent idempotency, CSRF rejection, private upload quarantine, staff access, native forms without JavaScript, and accessibility checks. The disposable storage-check and browser-upload objects were removed after verification; labelled test enquiries remain in the local database.

For repeatable browser verification against a running preview Worker:

```sh
TEST_BASE_URL=http://localhost:8787 pnpm test:e2e
```

Only use the browser suite against a disposable preview database: it creates labelled test enquiries and upload fixtures. With `TEST_BASE_URL` set, Playwright does not start a separate Node server.

## Preview limitations

The separate Node `scripts/worker.ts` job is not scheduled by this Cloudflare deployment. External CRM/email delivery remains disabled in preview, and uploaded artwork remains quarantined until the scanner job is configured. Production delivery, scanning, retention, MFA, backup/restore and final legal/content approval remain release requirements in the operations and launch checklists.

OpenNext labels Node middleware support experimental. Preserve the staff-access and noindex checks when upgrading Next, Payload, OpenNext or Wrangler.
