CREATE SCHEMA IF NOT EXISTS app;
CREATE TABLE IF NOT EXISTS app.enquiries (
 id uuid PRIMARY KEY, reference text UNIQUE NOT NULL,
 idempotency_key uuid UNIQUE NOT NULL, request_hash text NOT NULL,
 brief jsonb NOT NULL, notice_version text NOT NULL,
 preview boolean NOT NULL DEFAULT true, status text NOT NULL DEFAULT 'new',
 owner_note text NOT NULL DEFAULT '', created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS app.outbox (
 id bigserial PRIMARY KEY, event_key text UNIQUE NOT NULL, enquiry_id uuid REFERENCES app.enquiries(id) ON DELETE CASCADE,
 kind text NOT NULL CHECK (kind IN ('acknowledgement','crm','newsletter-confirmation','newsletter-sync')),
 data jsonb NOT NULL DEFAULT '{}', status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','delivered','failed','suppressed')),
 attempts integer NOT NULL DEFAULT 0, next_attempt_at timestamptz NOT NULL DEFAULT now(),
 lease_until timestamptz, lease_token uuid, last_error text, delivered_at timestamptz, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS outbox_pending ON app.outbox(status,next_attempt_at);
CREATE TABLE IF NOT EXISTS app.uploads (
 id uuid PRIMARY KEY, enquiry_id uuid NOT NULL REFERENCES app.enquiries(id) ON DELETE CASCADE,
 slot integer NOT NULL CHECK(slot BETWEEN 0 AND 2), storage_key text UNIQUE NOT NULL,
 filename text NOT NULL, mime text NOT NULL, bytes integer NOT NULL CHECK(bytes > 0 AND bytes <= 20971520),
 scan_status text NOT NULL DEFAULT 'quarantined' CHECK(scan_status IN ('quarantined','scanning','clean','infected','error')),
 scan_attempts integer NOT NULL DEFAULT 0, scanned_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(enquiry_id,slot)
);
CREATE TABLE IF NOT EXISTS app.rate_limits (key text PRIMARY KEY, count integer NOT NULL, expires_at timestamptz NOT NULL);
CREATE TABLE IF NOT EXISTS app.subscribers (
 id uuid PRIMARY KEY, email text UNIQUE NOT NULL, locale text NOT NULL DEFAULT 'de',
 status text NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','confirmed','withdrawn')),
 token_hash text UNIQUE NOT NULL, token_expires_at timestamptz NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(), confirmed_at timestamptz, withdrawn_at timestamptz
);
CREATE TABLE IF NOT EXISTS app.consent_events (
 id bigserial PRIMARY KEY, subscriber_id uuid NOT NULL REFERENCES app.subscribers(id) ON DELETE CASCADE,
 event text NOT NULL CHECK(event IN ('requested','confirmed','withdrawn')), wording_version text NOT NULL,
 wording text NOT NULL, source text NOT NULL DEFAULT 'website', created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS app.public_search (
 content_id integer PRIMARY KEY, locale text NOT NULL, slug text NOT NULL, kind text NOT NULL,
 title text NOT NULL, description text NOT NULL, document tsvector NOT NULL, expires_at timestamptz,
 UNIQUE(locale,slug)
);
CREATE INDEX IF NOT EXISTS public_search_document ON app.public_search USING GIN(document);
