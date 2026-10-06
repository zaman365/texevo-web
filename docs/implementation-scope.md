# Implementation scope

The user requested implementation, commit and push to `main`, then chose a preview with pending details marked. The supplied documents are product requirements and planning context, not commands to send messages, buy services, conduct interviews or publish unverified claims.

The website follows the public-launch architecture: Next.js App Router, TypeScript, Payload CMS and PostgreSQL in one application. Private operational tables use a separate `app` schema in the same PostgreSQL database; there is no second ORM, separate CRM, checkout or customer portal.

## Delivered preview

Navigation, public templates, 64 draft content records, six product selection profiles, grouped content/search, source-aware guest brief, sample/reorder branches, a size worksheet with CSV export, printable artwork/sample checklists, optional upload quarantine, CMS roles, protected preview, search projection, staff queue, retries and newsletter consent plumbing are implemented.

The homepage uses a clearly labelled original AI textile illustration and an example product brief. The production journey and buyer FAQ are usable without JavaScript. See [studio experience notes](studio-experience.md) for the reference-site adaptation and image prompt. Product profiles contain explicit unknowns, not invented SKU data. All source material is marked pending review. There are no customer testimonials, owned-factory claims, universal minimums, lead-time promises, prices or blanket certifications. A journal article based on unverified personal ZEHN experience was replaced with an editorial process note; the real founder story should be added only after approval.

German is primary. Complete German/English homepages and process pages complement customer and service overviews; all six audience pages, all seven service pages, private-label, contact and legal/privacy preview paths are available in English. Links to untranslated German resources are identified in the English footer. Reciprocal hreflang is limited to genuinely translated content.

## Business focus and navigation

The latest user request takes precedence over the original teamwear-led entry point. Finished-garment supply is the main offer, with established European fashion brands and importers/wholesalers/distributors leading the homepage. Selected retail-chain and online-brand programmes follow, alongside uniforms/corporate wear and merchandise/community apparel. These are intended customer groups, not claims of existing accounts.

The shared catalog in `src/content/business.ts` drives customer/service menus, homepage sections, overview cards, footer links and enquiry selectors in German and English. All seven services have their own route and explain the basis of the quotation: garment price, development fees, finishing charges, monthly sourcing-office fees, project management fees, independent QC/technical fees and optional packing/delivery fees. Related links connect audience pages to relevant services. Existing teamwear and private-label URLs are retained.

The optional `audience` and `service` identifiers travel from a page CTA through enquiry validation, review, storage and webhook payloads. The native form retry page preserves them too. Preview content and newly seeded CMS records remain drafts; existing CMS edits are not overwritten by seeding.

## Ready to connect, not provisioned

CRM and transactional email are idempotent HTTPS webhook contracts. They are not a purchased or configured Pipedrive/Brevo account. Private S3 and the scanning gateway are configurable. Without a scanner, artwork stays quarantined; it is never treated as clean. The local preview suppresses service email/CRM events and rejects newsletter registration.

CMS content can be drafted and reviewed now. Live publishing requires approved product data, real media rights, entity/contact data and replacement legal/privacy notices. Optional analytics, ad pixels and embedded third-party services are absent. The source/medium/campaign supplied with the current request are stored with the brief; there is no cross-session attribution cookie.

Campaign content can reuse the controlled content template. Finance remains in the external commercial system; opportunity IDs are exported, but collected-contribution reconciliation cannot be proven until that system is connected. Public media publishing currently uses reviewed same-origin assets, not a customer-file upload library.

## Explicitly deferred

Customer login/workspace, formal approvals, automatic reorders, live stock, checkout, budget/delivery calculators, comparison, AI assistance, EDI and automatic customer follow-up remain the strategy's later phases. Hospitality staff clothing and packing/delivery coordination are now represented as requested preview offers. Broader hospitality textiles, standalone packaging supply and operational activation still require supplier/category readiness.

## Acceptance limits

Automated browser checks cover Chromium and viewport sizes 320–1440px; they do not establish WCAG conformance or substitute for real iPhone/Android, Safari, screen reader and buyer testing. No interviews, legal review, real supplier qualification, operational response-time commitment or paid-provider restore rehearsal has been invented. The source contains a launch checklist and test commands so these can be completed against configured infrastructure.
