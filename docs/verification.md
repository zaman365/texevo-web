# Verification record

Preview verification performed on 6 October 2026. No real customer messages were sent.

- TypeScript strict type check passed.
- Eleven unit checks passed: brief validation, reorder reference, honeypot/length boundaries, file signatures/extensions, filename normalization, content uniqueness, complete translated catalog links, German search and validated customer/service context with native-form retry preservation.
- Ten Chromium browser checks passed: homepage/menu, all customer/service menu links, keyboard dismissal, mobile service-to-enquiry and English audience-to-enquiry flows, 320/390/768/1024/1440px layout, every seeded route, search/empty state, size totals and CSV, four-step mobile submission with a simulated outage/retry, idempotent concurrent submissions, CSRF, upload quarantine/access, no-JavaScript form, and representative accessibility scans.
- No serious or critical axe violations were reported on the home, brief, buying guide, size worksheet, English contact, customer and service overviews, wholesale audience page or expanded service menu.
- Customer/service selections were verified in the local PostgreSQL enquiry record. Replaying a test enquiry created before those optional fields were added returned its original receipt.
- New audience and service pages were added as unpublished CMS drafts (63 preview records in total); existing CMS edits were preserved.
- Initial PostgreSQL/Payload checks passed: drafts stay private, editor self-approval is rejected, roles cannot self-escalate, approved content is visible, search projection is updated, expired evidence is excluded.
- Simulated CRM outage preserved the enquiry; retry succeeded with the same idempotency key; simultaneous workers claimed the event once.
- Generated local administrator login and the protected staff enquiry queue were verified in Chromium.
- Initial application SQL and Payload migrations applied successfully to a fresh disposable PostgreSQL 17 database.
- Optimized Next.js production build passed. Dependency security checks are repeatable with `pnpm audit`.

Browser screenshots/traces live in ignored `test-results` and `playwright-report`, not the source repository. Generated local credentials, database files and uploads are ignored.

These checks do not establish production legal compliance, full WCAG conformance, field Web Vitals, real-device/Safari compatibility, functioning paid-provider integrations or an actual infrastructure restore. Those remain explicit launch checklist items.
