# Integration and data contracts

## Enquiry boundary

`POST /api/enquiries` accepts JSON or a URL-encoded short form. The shared Zod schema is `src/lib/brief-schema.ts`. Enquiries need a random UUID idempotency key, category, company, contact, email, a brief of at least ten characters and acknowledgement of the enquiry privacy notice. Phone, quantities, deadlines, budget and uploads are optional. Reorders require a reference. Newsletter permission is never inferred.

An enquiry and its acknowledgement/CRM outbox rows are inserted in one PostgreSQL transaction. A unique idempotency key binds to a normalized request hash. Identical retries return the same receipt; different content with the same key gets HTTP 409. No public enquiry list, read or update endpoint exists. Receipt pages display only the opaque reference supplied after POST; they never fetch private records.

Origin checking rejects cross-origin posts. Bodies have server-side limits. Rate limits are persisted and store only HMAC-derived keys. On an untrusted local deployment, callers share a bounded bucket; in production, configure a reverse proxy that replaces incoming forwarded headers before enabling `TRUST_PROXY=true`. The implementation reads the last forwarded hop; verify that convention against your actual ingress. Add upstream connection/body limits as well.

## Delivery worker

Run `pnpm worker` every minute. Workers claim rows atomically with `FOR UPDATE SKIP LOCKED` and a lease token. After eight attempts the event enters a visible failed queue. Retry delay increases up to six hours. Staff can requeue failed events. Accepted enquiries remain saved during outages. Backlog over 15 minutes triggers the configured alert webhook; logs contain error codes, not request bodies.

CRM and email gateways receive HTTPS JSON with `Authorization: Bearer <token>` and a stable `Idempotency-Key`. The payload contains `type`, `opportunityID`, `reference`, `submittedAt`, `brief`, `staffURL`, and `promotional: false`. Receivers **must persist the idempotency key and return success for retries without repeating the action**. A 2xx means the receiver has durably accepted responsibility. Never return 2xx merely because an in-memory task was started.

Configure the gateway to create/update one opportunity using `opportunityID`, create an assigned follow-up task and send a service acknowledgement in the requested locale. No response SLA is promised by the website. No private artwork is copied into CRM or email. Staff account emails use the same email gateway with `type: staff-email`; their sensitive content must not be logged.

## Uploads

`POST /api/enquiries/:id/files?slot=0|1|2` requires the upload capability returned after the matching enquiry. Capability is HMAC-derived from a random enquiry ID and its idempotency key, expires after 24 hours, and allows writes only. No file is retrievable using it. Three unique slots cap the request at 60 MB; each file is at most 20 MB. PDF/PNG/JPEG signatures and matching extensions are required. Filenames are normalized; storage keys are random.

Preview storage is `.data/private-files`; live mode requires a private S3-compatible bucket. Never serve that bucket or directory as public media. The scanner is a separately managed HTTPS gateway accepting binary bytes with bearer auth and returning exactly `{ "status": "clean" }` or `{ "status": "infected" }`. Use a maintained scanner, timeout limits and a private processing region. Transport failure or an unknown verdict leaves access closed. Infected objects are removed. Images are re-encoded after scanning to discard metadata. PDFs remain attachment-only downloads; antivirus is not a guarantee against all malicious content.

`GET /api/staff/files/:id` additionally requires Payload admin/sales authorization and a clean verdict. Responses are `private, no-store`, `nosniff`, attachment disposition and sandboxed. Test scanner outages and known safe test malware before enabling real artwork intake. Configure lifecycle cleanup for abandoned/orphaned objects and approve retention periods with the responsible owner.

## Newsletter

Disabled by default and always disabled in preview mode. Separate unchecked consent is required. A one-time expiring confirmation token activates the subscription. The ledger stores wording, version, request/confirmation/withdrawal times and source. A withdrawal is permanent under this flow; a later CRM import or repeated form request cannot resubscribe it.

Newsletter gateways receive current status and monotonic `consentVersion`. They must reject older revisions and apply suppression before any subsequent send. Every outbound newsletter must contain the supplied unsubscribe URL; configure one-click unsubscribe at the sender as appropriate. The worker rereads current consent, so a queued old event cannot intentionally restore a withdrawn state. A live delivery gateway must still enforce version ordering for concurrent network requests. Test this before setting `NEWSLETTER_ENABLED=true`.

## Search and publication

Preview searches labelled fixtures, with German spelling normalization and small synonyms. Live search uses a PostgreSQL tsvector projection of published, approved content. CMS hooks maintain it; public rendering rechecks publication/access, so stale search rows cannot expose a draft. Expired content is excluded. Draft preview needs both the staff gateway and an editorial Payload session. Private briefs, uploads and consent records never enter the search projection.
