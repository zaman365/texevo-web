# Cloudflare preview deployment

Deploy `main` to the `texevo-web` Worker in the TEXEVO Cloudflare account configured in `wrangler.jsonc`. The separate `codex/texevo-studio-experience` redesign is not part of this deployment. Keep `SITE_MODE=preview`: pending details and labelled examples remain visible, pages stay noindex, and external enquiry delivery/newsletters stay disabled.

## Provisioning status

As of 6 October 2026, the current `main` application is deployed at **https://texevo-web.zaman-ase365.workers.dev/de**. The public preview, enquiry persistence and private uploads are working. Hosted CMS sign-in has a confirmed runtime compatibility blocker described below; this is not a production-ready launch.

The private Tigris bucket `texevo-private-uploads` is in Frankfurt (`fra`), using Standard storage and no payment method. Its bucket-scoped application key is configured. Neon project `texevo-cloudflare-preview` (`misty-mud-45602859`) is on the free plan in AWS Frankfurt with PostgreSQL 17. Its `production` branch (`br-misty-art-b28tiswb`) contains the isolated `texevo` preview database. Application and CMS migrations succeeded, with 63 editorial drafts and one administrator. The branch name does not change the application's preview mode.

Hyperdrive connection `texevo-preview-db` (`b1f0468206c14d659fb4df9142cca7b4`) connects to the direct Neon endpoint with TLS and query caching disabled. The user approved storing the database credentials, Worker secrets and temporary deployment token. The `texevo.de` zone is active in Cloudflare and its existing origin records have not been changed. R2 is not used; its subscription was not activated. Do not reuse local development credentials or an unrelated Cloudflare account.

`HYPERDRIVE`, `ASSETS` and `WORKER_SELF_REFERENCE` are configured in `wrangler.jsonc`. Keep Hyperdrive query caching disabled for current enquiry, role and CMS state.

Missing database bindings or storage credentials fail closed. They never fall back to local PostgreSQL or an ephemeral filesystem on Workers. Hyperdrive maintains the upstream database pool; application connections use `maxUses: 1` because Workers cannot reuse a socket across requests.

These **runtime secrets** are configured on the Worker: `PAYLOAD_SECRET`, `ADMIN_GATE_USER`, `ADMIN_GATE_PASSWORD`, `S3_ACCESS_KEY_ID`, and `S3_SECRET_ACCESS_KEY`. Deployment-specific values are in ignored owner-only local files and Cloudflare secrets, outside Git and build artifacts. Seed administrator credentials are only needed by the one-time seed job. Database credentials belong in Hyperdrive; they are not plain Worker environment variables. When preparing Wrangler's JSON secrets file from dotenv, parse with `node:util`'s `parseEnv`; dotenv quotation marks must not become part of a credential value.

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

Use Node 22 and the pinned pnpm version. Releases use a clean local build from `main` and the approved, expiring API token for the configured TEXEVO account. The token is named `texevo-initial-deploy`, has account-level `Workers:Admin`, and expires on 7 October 2026 at 23:59 Europe/Berlin. Cloudflare requires product-level Admin to create a Worker; use a per-Worker token for future deployments after this token expires. Do not use the unrelated account in the existing global Wrangler login. Keep the token out of the build environment and supply it only to the deployment process.

Git-connected builds are not configured. If enabled later, configure Cloudflare Workers Builds for repository `zaman365/texevo-web`, production branch `main`, root `/`, and approve the build credential's permissions separately:

| Setting             | Value                                                                                                                             |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Build command       | `pnpm run build:cloudflare`                                                                                                       |
| Deploy command      | `pnpm run deploy:cloudflare`                                                                                                      |
| Other branch builds | Disabled until separate resources are provisioned                                                                                 |
| Build environment   | `SITE_MODE=preview`, `SITE_URL=https://texevo-web.zaman-ase365.workers.dev`, a non-secret build-only `PAYLOAD_SECRET` placeholder |

Build from a clean checkout without `.env` or `.env.local`. OpenNext can include dotenv file contents in its server environment module. Provision secrets at runtime, not in dotenv files in the build checkout. A clean build has empty environment maps in `.open-next/cloudflare/next-env.mjs`.

`open-next.config.ts` uses the supported webpack build for Cloudflare because Payload migration dependencies produce external dependency names that cannot be resolved by the Workers bundler after a Turbopack build. The regular local Next build is unchanged.

```sh
pnpm install --frozen-lockfile
SITE_MODE=preview SITE_URL=https://texevo-web.zaman-ase365.workers.dev \
  PAYLOAD_SECRET=build-only-non-production-placeholder pnpm build:cloudflare
# These ignored files are outside the clean build checkout.
# Wrangler's OpenNext wrapper requires a local Hyperdrive URL while preparing
# deployment. It does not replace the actual hosted Hyperdrive binding.
CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE=postgresql://texevo@127.0.0.1:55432/texevo \
  node --env-file=/Library/Projects/texevo-web/.env.cloudflare-deploy \
  node_modules/wrangler/bin/wrangler.js deploy \
  --secrets-file /Library/Projects/texevo-web/.env.worker-secrets \
  --message main-COMMIT --tag main-COMMIT
```

Replace `COMMIT` with the source commit. Keep the message/tag a single word because the OpenNext argument forwarder splits spaces. The secrets file is JSON containing only the five Worker runtime secrets. Scan the output bundle for the actual secret values before publishing. Do not copy local `.env`, `.dev.vars` or credentials into the release checkout.

The measured bundle is about 18.9 MiB uncompressed. Cloudflare's [current Workers size limit](https://developers.cloudflare.com/workers/platform/limits/#worker-size) is 64 MiB on Free and Paid. Free still has a 10 ms CPU limit per request, so validate CMS, authentication and form operations on the deployed runtime before routing the domain. A local emulator cannot establish that the free CPU allowance is sufficient.

Publish to the Worker URL first. Verify health, assets, database operations, staff gates and form origins before directing `texevo.de` to it. `SITE_URL` must match the origin used for submissions. Do not switch DNS before resolving the hosted CMS blocker. Keep the original DNS values available for rollback and record the deployed commit/version. The preview pages are publicly reachable and noindex; noindex is not access control. Basic authentication protects the CMS, staff and draft-preview routes. Account-wide Cloudflare Access is not configured because Zero Trust onboarding is incomplete.

## Validation

On 6 October 2026, strict TypeScript checking, 16 unit checks, the OpenNext build, Wrangler's deployment dry run and all 10 browser checks passed after switching to Tigris. A real Tigris connection check verified signed upload/read/delete and rejection of anonymous reads. Browser checks ran against the local Workers runtime with the actual private Tigris bucket and isolated local PostgreSQL through a local Hyperdrive binding. They covered responsive menus, routes, search, enquiry persistence/retries, concurrent idempotency, CSRF rejection, private upload quarantine, staff access, native forms without JavaScript, and accessibility checks. The disposable storage-check and browser-upload objects were removed after verification; labelled test enquiries remain in the local database.

Hosted verification passed all ten browser scenarios across the initial run and the upload retest: navigation, responsive layouts, English pages, public routes, search, worksheet printing, guided form validation, Neon persistence, native forms, accessibility, idempotency, CSRF rejection, private uploads and staff gates. Uploads initially failed because literal dotenv quotes were included in the two Tigris secrets; the corrected values passed the hosted upload/security scenario. CMS login is a separate failing check and is not covered by those ten public-site scenarios.

For repeatable browser verification against a running preview Worker:

```sh
TEST_BASE_URL=https://texevo-web.zaman-ase365.workers.dev pnpm test:e2e
```

Only use the browser suite against a disposable preview database: it creates labelled test enquiries and upload fixtures. With `TEST_BASE_URL` set, Playwright does not start a separate Node server.

## Preview limitations

**Hosted CMS sign-in is blocked.** Payload 3.90.2 uses PBKDF2-SHA256 with 600,000 iterations, but the hosted Workers runtime caps PBKDF2 at 100,000. The resulting error is swallowed by Payload's password verifier and appears to the user as incorrect credentials. The seeded administrator successfully authenticated through Payload's Node API against the same Neon database; hosted requests returned 401 with crypto callback errors. Local workerd does not enforce this hosted limit, so emulator tests cannot validate this behavior. See [Payload issue 18274](https://github.com/payloadcms/payload/issues/18274) and [Cloudflare's proposed cap fix](https://github.com/cloudflare/workerd/pull/7550), both still open when checked. Existing hashes and password strength were preserved. Resolve this with a supported runtime fix or a Node-hosted CMS/authentication service before production; do not reduce hashing strength or patch vendor auth to make a smoke test pass.

The separate Node `scripts/worker.ts` job is not scheduled by this Cloudflare deployment. External CRM/email delivery remains disabled in preview, and uploaded artwork remains quarantined until the scanner job is configured. Production delivery, scanning, retention, MFA, backup/restore and final legal/content approval remain release requirements in the operations and launch checklists.

OpenNext labels Node middleware support experimental. Preserve the staff-access and noindex checks when upgrading Next, Payload, OpenNext or Wrangler.
