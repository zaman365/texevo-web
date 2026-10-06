# Editorial guide

Public preview copy lives in `src/content/seed.ts`; the initial seed copies it to Payload as unpublished drafts. The seed never overwrites an existing draft. `/admin` is the editing surface, and its Preview action shows an authenticated draft view on the actual public template. Public preview fixture changes still require a source edit; live content reads from Payload directly.

## Workflow

Draft → technical review → approval → publish. Authors and editors work on copy and supporting notes. A reviewer or administrator supplies a real reviewer name, review date, evidence notes and an appropriate evidence status. Pending evidence cannot be published. Product publication additionally requires a supplier reference; images require usage-rights notes and descriptive alt text. Use version history to inspect or restore a previous revision, then review it again before publishing.

Do not use illustrative status to imply real stock, measurements, lead times, certifications or customer outcomes. Distinguish a process demonstration from a completed customer case. Record certificate issuer, subject/scope and expiry. Expired entries are excluded from public queries and search. Set the next review date; a responsible editor must review it on the agreed cadence.

## Models

The `content` collection uses controlled fields and ordered heading/text/list sections. Kinds select reusable public templates: offer, product, knowledge, journal, material, page, resource, project, evidence or campaign. This intentionally avoids a free-form page builder. Product facts require labels and values; include units and source notes for numbers. Relationships are internal slugs. CTA paths stay inside `/de/` or `/en/`.

Use German “Sie,” a concrete buyer task and a useful next step. Articles need an accountable author and reviewer, substantive answers and a related offer/resource. Published legal/privacy records can replace the preview utility text after the actual entity, processors, purposes, retention and contact channels are reviewed.

Public photos are reviewed same-origin files under `public/images`. Keep licensing, subject consent and provenance in the record. Never put artwork or original confidential evidence there. The private upload store is a separate security boundary. The preview hero is an attributed stock illustration and must not be represented as a TEXEVO sample, employee or factory.

## Search and translations

Publishing and deletion update the public PostgreSQL search projection. Rendering also checks the approved publication state, so private records cannot be revealed through a stale index. Search is dynamic; there is no shared cache of drafts. Maintain German vocabulary based on observed queries before expanding synonyms.

Add reciprocal translation paths only when both pages provide equivalent content and are approved. English production buyers already have a complete enquiry route. Links to untranslated German resources must be identified as such. Do not create empty locale stubs or dozens of city/industry pages.

## Launch replacements

Replace the six illustrative profiles with approved SKU records and real specifications; approve the six guides, three journal posts, six material entries and three resources; add permitted personal biographies/photography and actual contact/entity data. The ZEHN experience article was deliberately not fabricated. Add it only from first-hand approved material.
