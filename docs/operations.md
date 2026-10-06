# Operations runbook

## Ownership and environments

Assign real commercial, editorial, technical and backup owners before live release. Use separate preview/staging/production databases, buckets, gateways and secrets. Default `SITE_MODE=preview` suppresses external delivery. Keep staging behind an identity gateway; `noindex` does not prevent access.

Local credentials are generated into the ignored `.env`. Use a secret manager in production. `PAYLOAD_SECRET` must have at least 32 random characters. Rotate credentials after incidents and coordinate Payload secret rotation with session invalidation and outstanding upload/unsubscribe capabilities. Require staff MFA at the deployment identity layer; the built-in Basic staging gate is an additional access barrier, not a second factor.

## Release

1. Back up database and private objects. Record the previous image/commit and migration compatibility.
2. Apply application SQL with `pnpm db:migrate`; apply Payload migrations with `NODE_ENV=production pnpm cms:migrate`. Never use schema push on production.
3. Build with `pnpm build`. Run configured acceptance checks, then start the Node service and one-minute worker schedule.
4. Check `/api/health`, public pages, anonymous access denial, a synthetic enquiry, service delivery and scan queue. Synthetic tests must use an explicitly approved test recipient/destination.
5. Switch traffic only after acceptance; preserve the previous deployment for rollback. Do not automatically roll back a database migration that may have received new data. Prefer a forward repair or a compatible application rollback.

The supplied GitHub Actions workflow builds/tests on pushes and PRs; it does not deploy. Its database and credentials are disposable CI fixtures. Production environment setup and access review remain separate.

## Daily triage

Open `/de/intern` using an admin or sales Payload account. Review new enquiries, assign ownership in the connected CRM, and resolve failed outbox events. Verify the destination before retrying; receivers must honour the stable idempotency key. A file without a clean scan result has no download link. Escalate scan failures rather than overriding a verdict manually.

Monitor external uptime, health, failed/silent worker runs, outbox backlog older than 15 minutes, database/storage usage, pending scans, expired evidence and review dates. The included alert webhook contains only event type and count; configure delivery and deduplication at the monitoring service. Do not write email addresses, briefs, authorization headers, file contents or connection strings into routine logs.

## Backups and restoration

Target RPO ≤24h and RTO ≤4h, subject to the selected provider's real capabilities. Configure managed PostgreSQL backups plus an encrypted independent export and matching private-object backup. Include Payload content/users/versions, `app` tables and object keys. Database-only restoration is not enough for artwork.

Before launch and quarterly, restore into a separate locked staging environment with **external gateways disabled**. Verify row counts, a sample of content versions, private files, reference/outbox relationships, user-role boundaries and a synthetic enquiry. Record measured recovery time and the person who verified it. Only then set `RESTORE_REHEARSED=true`. No purchased-provider recovery test was performed during this preview implementation.

For a local/disposable test database, standard PostgreSQL tools can be used without embedding passwords in commands:

```sh
pg_dump --format=custom --file=/secure/path/texevo.dump "$DATABASE_URL"
# Restore only into a separately created, isolated target database:
pg_restore --dbname="$RESTORE_DATABASE_URL" --no-owner /secure/path/texevo.dump
```

Protect exported data, object backups and terminal history according to the approved policy. Secrets and archives must never enter Git.

## Retention and privacy requests

Retention periods are deliberately not enacted as an unreviewed automatic deletion schedule. Approve an enquiry review/deletion period, quarantine/orphan cleanup, newsletter inactivity handling, commercial exceptions and backup expiry first. Record any legal hold. Use the source opportunity ID and subscriber ID to reconcile deletion/export with CRM, sender, private storage and backups. Sender suppression must survive a deletion where required to honour withdrawal; determine the minimum retained record with the responsible privacy owner.

Local test data can be removed by stopping the isolated database and deleting its dedicated `.data` directory only after confirming it contains no wanted work. Never use that shortcut on a shared or live environment.

## Incident response

Restrict affected ingress/credentials, preserve only necessary diagnostic evidence, keep quarantined files blocked, and notify the designated owner. Determine which records/services are affected, meet the organization's approved notification process, repair, rotate compromised credentials, and rerun the relevant authorization/delivery checks before restoring access.
