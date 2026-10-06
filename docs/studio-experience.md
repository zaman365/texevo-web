# TEXEVO studio experience

## Direction

The reference was [Rook's English website](https://rook-workspace.com/en), reviewed on 6 October 2026. The useful patterns were its spacious hierarchy, visual connection between production stages, expandable process information and clear entry into a project conversation. TEXEVO adapts those interaction and layout ideas with original copy, its existing ink/ivory/terracotta identity and its own apparel-sales model.

The homepage now introduces garment supply, presents all six customer groups and seven services, explains the difference between buying garments and commissioning a service, then walks through production decisions. This preserves the emphasis on established fashion brands and the apparel trade. No competitor copy, screenshots, logos, testimonials, business statistics, platform functionality or supplier claims were reused.

## Experience

- German and English homepages with reciprocal language metadata.
- Sticky navigation, existing customer/service menus and an in-page section index.
- An illustrated product brief explaining specification, samples and repeat supply. It is labelled as an example, not a live customer dashboard.
- Seven native disclosure sections with outputs, decisions and context-aware enquiry links; one stage expands at a time.
- Six buyer FAQs covering contractual routes, quantities, technical readiness, pricing/timing, quality and repeat orders.
- Consistent typography, cards, controls and page styling across the existing offers, articles, resources and forms.
- Native disclosure interactions also work without JavaScript. Scrolling stays immediate, and reduced-motion preferences disable transitions. Existing validation, native enquiry submission and persistence remain in place.

The process copy is shared in `src/content/journey.ts`; German and English CMS seed records use the same content. Dedicated process pages continue to render their CMS-managed sections. Preview seeding adds missing records but does not overwrite existing editorial changes. Pending business details, approval rules, noindex and test-only enquiry behaviour remain unchanged.

## Original image

- Mode: built-in `image_gen` generation, one original asset.
- Workspace asset: `public/images/textile-study.webp` (1536 × 1024, approximately 213 KB).
- Use: homepage product brief and process introduction, with visible AI-illustration captions.
- The original output was converted to WebP for web delivery. It is a conceptual still life, not evidence of TEXEVO products, premises or manufacturing capability.

### Final generation prompt

Use case: photorealistic-natural. Asset type: original editorial textile image for the TEXEVO B2B apparel website, not a photograph of a real TEXEVO facility or actual products. Create a high-end, tactile fashion product-development still life in a quiet sunlit studio, landscape 3:2 composition. On a warm pale limestone worktable: an unbranded sand cotton overshirt neatly folded so collar, front placket, natural buttons and precise topstitching are visible, a dark ink navy fabric piece and a muted rust fabric swatch overlapping the bottom left, a small stack of cream paper pattern pieces at right, a spool of warm off-white thread and fine metal tailoring scissors. A minimal black garment rail with two softly out-of-focus neutral unbranded garments in the upper background. Main shirt occupies the center-left; restrained negative space, strong natural side light, nuanced shadows, matte real fabric fibers, realistic editorial photography, quiet premium European textile design feel. Palette: warm ivory, flax, ink navy, muted terracotta, restrained olive. No people, hands, logos, readable text, watermarks, certificates, factory floor, digital screens or graphic overlays. Avoid glossy synthetic render, excessive props, dramatic lighting, excessive bokeh. Compose to crop naturally both to a landscape hero visual and a tall material-detail panel.

## Scope boundaries

The site does not claim a live production portal, AI cost forecasting, owned factories, certified supply chains, fixed delivery timelines or completed customer projects. Those would require real operational evidence and separate implementation. No services were purchased and the branch push is not a public deployment.
