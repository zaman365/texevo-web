export type BusinessLocale = 'de' | 'en'
type Copy = { label: string; description: string; slug: string }
export type Audience = {
  id: string
  group: 'trade' | 'teams'
  core?: boolean
  de: Copy
  en: Copy
  services: string[]
}
export type Service = {
  id: string
  category: string
  de: Copy & { basis: string }
  en: Copy & { basis: string }
}

export const audiences: Audience[] = [
  {
    id: 'fashion',
    group: 'trade',
    core: true,
    de: {
      label: 'Modemarken',
      slug: 'kunden/modemarken',
      description:
        'Private-Label-Kollektionen, individuelle Produktion und wiederkehrende Belieferung für etablierte europäische Marken.',
    },
    en: {
      label: 'Fashion brands',
      slug: 'customers/fashion-brands',
      description:
        'Private-label collections, custom production and repeat supply for established European brands.',
    },
    services: ['supply', 'development', 'office'],
  },
  {
    id: 'wholesale',
    group: 'trade',
    core: true,
    de: {
      label: 'Importeure & Großhandel',
      slug: 'kunden/importeure-grosshandel',
      description:
        'Fertige Bekleidung in größeren Mengen, exklusive Modelle und Nachlieferprogramme für Importeure, Großhändler und Distributoren.',
    },
    en: {
      label: 'Importers & wholesalers',
      slug: 'customers/importers-wholesalers',
      description:
        'Finished garments in bulk, exclusive styles and replenishment programmes for importers, wholesalers and distributors.',
    },
    services: ['supply', 'management', 'logistics'],
  },
  {
    id: 'retail',
    group: 'trade',
    de: {
      label: 'Filialisten & Modegruppen',
      slug: 'kunden/filialisten-modegruppen',
      description:
        'Ausgewählte Warengruppen, saisonale Sortimente und Unterstützung bei Kapazitätsengpässen oder Lieferantenwechseln.',
    },
    en: {
      label: 'Retail chains & fashion groups',
      slug: 'customers/retail-fashion-groups',
      description:
        'Selected product categories, seasonal ranges and support with overflow production or supplier transitions.',
    },
    services: ['supply', 'office', 'quality'],
  },
  {
    id: 'online',
    group: 'trade',
    de: {
      label: 'Wachsende Online-Marken',
      slug: 'kunden/online-marken',
      description:
        'Eigene Produkte, Bemusterung und auftragsbezogene Produktion für wachsende Shopify-, Amazon- und andere Online-Marken.',
    },
    en: {
      label: 'Growing online brands',
      slug: 'customers/online-brands',
      description:
        'Own-label products, sampling and production against orders for growing Shopify, Amazon and other online brands.',
    },
    services: ['supply', 'development', 'finishing'],
  },
  {
    id: 'uniform',
    group: 'teams',
    de: {
      label: 'Uniformen & Corporate Wear',
      slug: 'kunden/uniformen-corporate',
      description:
        'Polos, Hemden, Hosen, Jacken und weitere Mitarbeiterkleidung für Uniformanbieter, Hotel- und Gastronomiegruppen sowie Unternehmen.',
    },
    en: {
      label: 'Uniforms & corporate wear',
      slug: 'customers/uniforms-corporate',
      description:
        'Branded polos, shirts, trousers, jackets and staff clothing for uniform suppliers, hospitality groups and corporate buyers.',
    },
    services: ['supply', 'finishing', 'logistics'],
  },
  {
    id: 'merchandise',
    group: 'teams',
    de: {
      label: 'Merchandise & Community',
      slug: 'kunden/merchandise-community',
      description:
        'Individuelle T-Shirts, Hoodies und Markenartikel für Merchandise-Agenturen, etablierte Creator-Marken und Vereine.',
    },
    en: {
      label: 'Merchandise & community',
      slug: 'customers/merchandise-community',
      description:
        'Custom T-shirts, hoodies and branded merchandise for agencies, established creator brands and clubs.',
    },
    services: ['supply', 'finishing', 'development'],
  },
]

export const services: Service[] = [
  {
    id: 'supply',
    category: 'production',
    de: {
      label: 'Bekleidungslieferung',
      slug: 'bekleidungslieferung',
      description:
        'Fertige Bekleidung für Ihr Geschäft: Private Label, individuelle Produktion, Großmengen und Nachlieferprogramme.',
      basis: 'Großhandelspreis je Kleidungsstück mit vereinbartem Lieferumfang.',
    },
    en: {
      label: 'Finished-garment supply',
      slug: 'garment-supply',
      description:
        'Garments for your business: private label, custom production, bulk orders and repeat supply.',
      basis: 'Wholesale price per garment with an agreed supply scope.',
    },
  },
  {
    id: 'development',
    category: 'sample',
    de: {
      label: 'Entwicklung & Muster',
      slug: 'produktentwicklung',
      description:
        'Designs, Schnitte, Gradierung, Materialentwicklung und Musterpakete als Grundlage Ihrer Produktion.',
      basis:
        'Vereinbarte Entwicklungs- und Mustergebühren; eine Anrechnung auf den Serienauftrag ist nach Vereinbarung möglich.',
    },
    en: {
      label: 'Development & sampling',
      slug: 'product-development',
      description:
        'Designs, patterns, grading, fabric development and sample packages to prepare your production.',
      basis: 'Agreed development and sampling fees; credit against a bulk order may be agreed.',
    },
  },
  {
    id: 'finishing',
    category: 'production',
    de: {
      label: 'Veredelung & Ausstattung',
      slug: 'veredelung',
      description:
        'Druck, Stick, Labels, Zubehör und individuelle Verpackung für Ihren Markenauftritt.',
      basis: 'Separat ausgewiesene Kosten nach Ausführung und Menge.',
    },
    en: {
      label: 'Customisation & finishing',
      slug: 'customisation',
      description: 'Printing, embroidery, labels, trims and custom packaging for your brand.',
      basis: 'Separately quoted work based on specification and quantity.',
    },
  },
  {
    id: 'office',
    category: 'sourcing',
    de: {
      label: 'Sourcing Office',
      slug: 'sourcing-office',
      description:
        'Laufende Begleitung eines definierten Lieferantenportfolios, einer Kategorie oder eines Produktionsprogramms.',
      basis: 'Monatliches Honorar für einen klar vereinbarten Leistungsumfang.',
    },
    en: {
      label: 'Sourcing office',
      slug: 'sourcing-office',
      description:
        'Ongoing support for a defined supplier portfolio, category or production programme.',
      basis: 'Monthly fee for an agreed scope of work.',
    },
  },
  {
    id: 'management',
    category: 'sourcing',
    de: {
      label: 'Produktionsmanagement',
      slug: 'produktionsmanagement',
      description:
        'Projektbezogene Koordination, wenn Sie die Waren direkt bei der Fabrik beauftragen.',
      basis:
        'Festes Projekthonorar oder vereinbarter Prozentsatz mit definierter Berechnungsgrundlage.',
    },
    en: {
      label: 'Production management',
      slug: 'production-management',
      description:
        'Project coordination when you contract directly with the factory for the goods.',
      basis: 'Fixed project fee or agreed percentage with a defined calculation basis.',
    },
  },
  {
    id: 'quality',
    category: 'sourcing',
    de: {
      label: 'QC & technische Unterstützung',
      slug: 'qualitaetssicherung',
      description:
        'Separat beauftragte Qualitätskontrollen, Fabrikbewertungen und technische Korrekturmaßnahmen.',
      basis: 'Honorar je vereinbarter Inspektion, Bewertung oder technischer Aufgabe.',
    },
    en: {
      label: 'QC & technical support',
      slug: 'quality-support',
      description:
        'Separately commissioned inspections, factory assessments and technical corrective-action support.',
      basis: 'Fee per agreed inspection, assessment or technical assignment.',
    },
  },
  {
    id: 'logistics',
    category: 'other',
    de: {
      label: 'Verpackung & Lieferkoordination',
      slug: 'logistik',
      description:
        'Packvorgaben, Versandabstimmung und Lieferkoordination als ergänzende Leistung.',
      basis: 'Vereinbarte Bearbeitungs- oder Koordinationsgebühr für zusätzliche Leistungen.',
    },
    en: {
      label: 'Packing & delivery coordination',
      slug: 'delivery-coordination',
      description:
        'Packing instructions, dispatch planning and delivery coordination as additional services.',
      basis: 'Agreed handling or coordination fee for additional work.',
    },
  },
]

export const businessHref = (item: Audience | Service, locale: BusinessLocale) =>
  `/${locale}/${item[locale].slug}`
export function enquiryHref(locale: BusinessLocale, service = 'supply', audience = '') {
  const query = new URLSearchParams({
    category: services.find((s) => s.id === service)?.category || 'production',
    service,
  })
  if (audience) query.set('audience', audience)
  return `/${locale}/${locale === 'de' ? 'anfrage' : 'contact'}?${query}`
}
