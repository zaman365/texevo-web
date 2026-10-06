# TEXEVO website

German-first B2B textile website implementing the launch direction in the supplied TEXEVO strategy (5 October 2026) and website blueprint (6 October 2026). The commissioned deliverable is a **reviewable preview**, with pending business information explicitly marked. No paid infrastructure was provisioned and no public deployment is implied by pushing this repository.

## Included

- Textile-workroom design: ink, sample paper, vermilion, self-hosted Source Serif 4 / Source Sans 3, responsive desktop/mobile layouts.
- Garment supply leads the homepage. Grouped customer/service menus, six customer segments and seven service offers are available in German and English; teamwear, private label, process, samples, evidence, partner and company routes remain accessible.
- Six illustrative product profiles, six buying guides, three journal drafts, six material entries, two labelled process demonstrations and three buyer resources.
- Four-step and short enquiry with customer/service context, sample and reorder requests, server validation, recoverable failures, no-JavaScript submission, durable reference and atomic delivery outbox.
- Optional private PDF/PNG/JPEG uploads, signature/extension/size checks, three-file limit, scan quarantine and authorized post-scan downloads.
- Payload CMS with drafts, versions, editorial roles, protected preview, publication guards and PostgreSQL public search projection.
- Staff enquiry/failure view at `/de/intern`; retry worker, health endpoint, disabled-by-default double-opt-in newsletter and consent ledger.
- Accessibility, responsive, browser, authorization and delivery-failure checks; initial database migrations and GitHub Actions.

## Run locally

Use Node 22 LTS, pnpm 10.18.3 and PostgreSQL 17+. Versions are pinned in the lockfile.

```sh
pnpm install --frozen-lockfile
pnpm setup:local
pnpm db:migrate
pnpm seed
pnpm dev
```

Open [the preview](http://localhost:3000/de). `setup:local` creates an isolated PostgreSQL instance in `.data/postgres` on loopback port 55432 and generates `.env` credentials. It does not use or change another PostgreSQL database. Local database authentication is trust-based on loopback only: **do not use this setup on a shared or public server**. Stop it with `pg_ctl -D .data/postgres stop` when finished.

Alternatively, use `compose.yaml` with your own `POSTGRES_PASSWORD`, copy `.env.example` to `.env`, set `DATABASE_URL`, and generate strong secrets. Run `pnpm db:migrate`, `NODE_ENV=production pnpm cms:migrate`, and `pnpm seed` before starting. Never commit `.env` or `.data`.

The public review preview renders labelled fixtures from `src/content/seed.ts`. CMS seeding copies those into **unpublished drafts**. Edit and preview each draft in `/admin`; staff preview is authenticated. `SITE_MODE=live` reads only approved, unexpired, published CMS records and never falls back to fixtures. This separation keeps unfinished CMS drafts out of public search and makes the pending content visible in the requested review preview.

Staff access has two layers: the deployment gate (`ADMIN_GATE_USER` / `ADMIN_GATE_PASSWORD`) and a Payload account (`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` for the generated local account). Credentials are in your local `.env`. A production identity gateway with MFA must replace or sit in front of the staging gate; HTTP Basic is **not** MFA. Administrators/reviewers approve content; editors cannot approve their own content or change their role. Only administrators and sales staff can read commercial briefs and scanned artwork.

## Check the implementation

```sh
pnpm typecheck
pnpm test
pnpm test:backend
pnpm exec playwright install chromium
pnpm test:e2e             # local server must be running on http://localhost:3000
pnpm audit --prod
pnpm build
```

Backend verification creates and cleans up isolated test users/content, then simulates a CRM outage and retry without contacting an external service. Browser tests leave labelled test enquiries in the preview database, including a quarantined PDF fixture. Do not run backend tests against a real customer database.

## Deployment preparation

This repository supports Node hosting and Cloudflare Workers through OpenNext; it is **not approved for public commercial launch**. See [Cloudflare deployment](docs/cloudflare-deployment.md), [launch checklist](docs/launch-checklist.md), [operations runbook](docs/operations.md), [integration contracts](docs/integrations.md), [content guide](docs/content-guide.md) and [implementation scope](docs/implementation-scope.md).

`pnpm check:launch` deliberately fails with the pending items in this preview. It is a configuration check, not certification of legal compliance, accessibility, supplier capability or operational readiness. Do not change `SITE_MODE` until content, identity, processors, MFA, infrastructure and recovery have been approved. Keep preview/staging behind access control and noindex; noindex is not authentication.

After a clean production database is provisioned, apply `pnpm db:migrate` and `NODE_ENV=production pnpm cms:migrate` once as a release job. Never run the preview seed on live infrastructure. Run `pnpm build` then `pnpm start`; schedule `pnpm worker` once per minute as a separate process. Node standalone packaging must include `.next/static` and `public` alongside the standalone output. Database and object storage need persistent, backed-up volumes/services.

## Assets and licenses

The hero is a labelled **illustration**, not product or supplier evidence: [Moonstarious Project on Unsplash](https://unsplash.com/photos/a-stack-of-bright-colored-cloths-on-a-white-surface-H7I8mOX3K8s), downloaded from the image URL returned for that photograph. It is used under the [Unsplash License](https://unsplash.com/license). Replace it with approved original photography before launch if required by the creative brief. No generated people, factories, customer references or certification marks are used.

Source Serif 4 and Source Sans 3 are bundled through Fontsource under their included OFL licenses. Dependencies retain their individual licenses. TEXEVO name and trademark clearance remain pending.
