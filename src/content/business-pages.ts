import { audiences, services, businessHref, enquiryHref, type BusinessLocale } from './business'
import type { ContentRecord, ContentSection } from './types'

const section = (heading: string, text: string, items?: string[]): ContentSection => ({
  heading,
  text,
  items,
})
const audienceDetails: Record<string, { de: ContentSection[]; en: ContentSection[] }> = {
  fashion: {
    de: [
      section(
        'Kollektionen und wiederkehrende Belieferung',
        'Für etablierte europäische Modemarken steht der Warenbezug im Mittelpunkt: eine eigene Kollektion, einzelne Modelle oder ein fortlaufendes Basisprogramm. Entwicklung, Muster und Ausstattung werden passend zum Produktionsauftrag abgegrenzt.',
        [
          'Private-Label-Kollektionen nach eigener Spezifikation',
          'Individuelle Produktion mit dokumentierter Musterfreigabe',
          'Wiederholungsaufträge und saisonale Weiterentwicklung',
        ],
      ),
      section(
        'Für Ihr erstes Briefing',
        'Nennen Sie Warengruppen, Modell- und Farbanzahl, Mengen je Variante, Zielpreise und den gewünschten Lieferkalender. Vorhandene Tech-Packs sowie Zuständigkeiten für Design und Freigabe helfen, den offenen Entwicklungsbedarf zu bestimmen.',
      ),
    ],
    en: [
      section(
        'Collections and repeat supply',
        'For established European fashion brands, the focus is garment supply: an own-label collection, selected styles or an ongoing core range. Development, samples and finishing are scoped around the production order.',
        [
          'Private-label collections to your specification',
          'Custom production with documented sample approval',
          'Repeat orders and seasonal range development',
        ],
      ),
      section(
        'Preparing your brief',
        'Share categories, styles, colours, quantities per variant, target prices and delivery calendar. Existing tech packs and clear design and approval responsibilities help identify development work still needed.',
      ),
    ],
  },
  wholesale: {
    de: [
      section(
        'Ware für Ihren Vertrieb',
        'Importeure, Großhändler und Distributoren benötigen klar definierte Artikel und kaufmännisch planbare Programme. Besprechen Sie fertige Bekleidung in größeren Mengen, exklusive Modelle oder wiederkehrende Nachlieferungen.',
        [
          'Mengenplanung je Modell, Farbe, Größe und Absatzmarkt',
          'Exklusivität nach Gebiet, Laufzeit und Mindestabnahme schriftlich vereinbaren',
          'Nachlieferprogramme mit erneuter Preis-, Termin- und Verfügbarkeitsprüfung',
        ],
      ),
      section(
        'Sortiment und Übergabe festlegen',
        'Artikelkennzeichnung, Verpackungseinheiten, Kartonvorgaben, Lieferorte und die Verteilung der Importaufgaben gehören in das Briefing. Ein Programm ist erst belastbar, wenn Spezifikation, Mengen und Bedingungen bestätigt sind.',
      ),
    ],
    en: [
      section(
        'Garments for your distribution business',
        'Importers, wholesalers and distributors need defined products and commercially planned programmes. Discuss finished garments in bulk, exclusive styles or replenishment supply.',
        [
          'Volumes by style, colour, size and destination market',
          'Exclusivity agreed in writing by territory, term and purchase commitment',
          'Replenishment subject to renewed price, timing and availability checks',
        ],
      ),
      section(
        'Agree the range and handover',
        'Include labelling, pack sizes, carton requirements, delivery locations and responsibilities for import work in the brief. Specifications, volumes and commercial terms must be confirmed for each programme.',
      ),
    ],
  },
  retail: {
    de: [
      section(
        'Mit einer ausgewählten Kategorie beginnen',
        'Für Filialisten und größere Modegruppen bietet sich ein klar abgegrenztes Sortiment an. Der Einstieg kann eine saisonale Range, eine zusätzliche Produktionsmenge oder eine Übergangsphase zwischen Lieferanten sein.',
        [
          'Ausgewählte Warengruppen und saisonale Sortimente',
          'Zusätzliche Produktion bei Kapazitätsengpässen',
          'Dokumentierte Übergabe bei Lieferantenwechseln',
        ],
      ),
      section(
        'An Ihren Einkaufsprozess anschließen',
        'Lieferantenaufnahme, technische Standards, Musterstufen, Prüfanforderungen und Lieferfenster werden vor der Zusage geprüft. Umfangreiche Programme beginnen mit einer Machbarkeitsprüfung; ungeprüfte Kapazität oder freigegebener Lieferantenstatus werden nicht vorausgesetzt.',
      ),
    ],
    en: [
      section(
        'Start with a defined category',
        'For retail chains and larger fashion groups, an initial programme can cover a selected category, seasonal range, overflow order or supplier transition.',
        [
          'Selected categories and seasonal ranges',
          'Additional production for capacity gaps',
          'Documented handover during supplier transitions',
        ],
      ),
      section(
        'Fit your buying process',
        'Vendor onboarding, technical standards, sample stages, testing requirements and delivery windows are reviewed before a commitment. Larger programmes require feasibility review; capacity and approved-vendor status are not assumed.',
      ),
    ],
  },
  online: {
    de: [
      section(
        'Vom erprobten Produkt zur eigenen Produktion',
        'Für wachsende Shopify-, Amazon- und andere Online-Marken werden passende Projekte einzeln geprüft. Im Mittelpunkt stehen Produkte unter Ihrer Marke, ein vereinbarter Musterumfang und Produktion gegen konkrete Aufträge.',
        [
          'Eigene Spezifikation, Labels und Verpackung',
          'Musterpaket mit Budget und Freigabekriterien',
          'Produktionsmengen passend zu Ihrem Absatzplan',
        ],
      ),
      section(
        'Mengen und Produktreife zuerst klären',
        'Nennen Sie bisherige Produktbasis, geplante Stückzahlen, Zielkosten und Absatzmärkte. Anforderungen Ihres Shops oder Marktplatzes an Kennzeichnung und Verpackung gehören ins Briefing. Eine Shop-Einrichtung, Absatzgarantie oder automatische Plattformfreigabe ist nicht Bestandteil des Angebots.',
      ),
    ],
    en: [
      section(
        'From a proven product to own-label production',
        'Projects for growing Shopify, Amazon and other online brands are assessed individually. The focus is own-label products, a defined sampling scope and production against confirmed orders.',
        [
          'Your specification, labels and packaging',
          'A sample package with a budget and approval criteria',
          'Production quantities aligned with your sales plan',
        ],
      ),
      section(
        'Clarify volumes and product readiness',
        'Share your existing product base, planned quantities, target costs and markets. Include any shop or marketplace requirements for labels and packaging. Store setup, guaranteed sales and automatic platform approval are outside this apparel offer.',
      ),
    ],
  },
  uniform: {
    de: [
      section(
        'Bekleidung für den täglichen Einsatz',
        'Uniformanbieter, Hotel- und Gastronomiegruppen sowie Unternehmen können abgestimmte Mitarbeiterkleidung planen. Dazu gehören Polos, Hemden, Hosen und Jacken mit passender Kennzeichnung und Veredelung.',
        [
          'Einheitlicher Auftritt über Funktionen und Standorte hinweg',
          'Größen, Passformen und Pflege im tatsächlichen Einsatz prüfen',
          'Referenzen für spätere Ergänzungen dokumentieren',
        ],
      ),
      section(
        'Teamkleidung praktisch vorbereiten',
        'Nennen Sie Tragesituation, Teamgröße, Größenverteilung, Logo und benötigte Ausstattung. Ein Muster kann Passform und Veredelung klären. Es geht um normale Bekleidung; Schutzwirkungen oder eine Eignung als persönliche Schutzausrüstung sind nicht zugesagt.',
      ),
    ],
    en: [
      section(
        'Clothing for everyday work',
        'Uniform suppliers, hospitality groups and corporate buyers can plan coordinated staff clothing, including branded polos, shirts, trousers and jackets.',
        [
          'A consistent appearance across roles and locations',
          'Sizes, fits and care requirements checked in actual use',
          'Documented references for future additions',
        ],
      ),
      section(
        'Prepare your teamwear brief',
        'Share the working environment, headcount, size distribution, logo and finishing requirements. A sample can establish fit and decoration. This offer covers ordinary clothing; protective performance or suitability as personal protective equipment is not promised.',
      ),
    ],
  },
  merchandise: {
    de: [
      section(
        'Textile Produkte für Ihre Community',
        'Merchandise-Agenturen, etablierte Creator-Marken und Vereine können T-Shirts, Hoodies und weitere textile Markenartikel entwickeln oder veredeln lassen. Produktauswahl, Gestaltung und Mengenplanung bilden die Grundlage.',
        [
          'T-Shirts und Hoodies mit Druck oder Stick',
          'Eigene Labels, Zubehör und Verpackung nach Vereinbarung',
          'Projektserien, Wiederholungsauflagen und Vereinsbedarf',
        ],
      ),
      section(
        'Artwork, Freigabe und Termin verbinden',
        'Nennen Sie Motive, Nutzungsrechte, Modellwünsche, Mengen je Größe und den Zieltermin. Vereinbaren Sie Muster und Motivfreigaben vor dem Serienauftrag. Webshop-Betrieb, Einzelkundenversand und garantierte Eventtermine sind nur bei gesondert bestätigtem Umfang eingeschlossen.',
      ),
    ],
    en: [
      section(
        'Textile products for your community',
        'Merchandise agencies, established creator brands and clubs can develop or customise T-shirts, hoodies and other branded apparel. Product selection, artwork and quantity planning form the brief.',
        [
          'T-shirts and hoodies with print or embroidery',
          'Own labels, trims and packaging by agreement',
          'Project runs, repeat editions and club apparel',
        ],
      ),
      section(
        'Connect artwork, approvals and timing',
        'Include artwork, usage rights, preferred garments, quantities by size and the target date. Agree samples and artwork approvals before the bulk order. Store operations, individual consumer fulfilment and guaranteed event dates require a separately confirmed scope.',
      ),
    ],
  },
}

const serviceDetails: Record<string, { de: ContentSection[]; en: ContentSection[] }> = {
  supply: {
    de: [
      section(
        'Das Hauptangebot: fertige Bekleidung',
        'Sie kaufen die vereinbarten Kleidungsstücke von TEXEVO. Private-Label-Kollektionen, individuelle Produktion, Großhandelsmengen und wiederkehrende Lieferungen bilden den Kern des Angebots.',
        [
          'Spezifikation und Musterfreigabe als Produktionsgrundlage',
          'Mengen je Modell, Farbe und Größe',
          'Vereinbarte Ausstattung, Verpackung und Lieferbedingungen',
        ],
      ),
      section(
        'Vom ersten Auftrag zum Nachlieferprogramm',
        'Ein bestätigter Artikel kann die Grundlage für Folgeaufträge bilden. Verfügbarkeit, Materialpartie, Mengen, Preis und Liefertermin werden bei jeder Bestellung neu abgestimmt. Exklusive Modelle und Wiederbeschaffungsprogramme benötigen eigene Vereinbarungen.',
      ),
    ],
    en: [
      section(
        'The main offer: finished garments',
        'You purchase the agreed garments from TEXEVO. Private-label collections, custom production, wholesale volumes and repeat supply form the core offer.',
        [
          'Specifications and sample approval as the production reference',
          'Quantities by style, colour and size',
          'Agreed trims, packaging and delivery terms',
        ],
      ),
      section(
        'From a first order to repeat supply',
        'An approved product can provide a reference for future orders. Availability, material batches, quantities, prices and delivery dates are reconfirmed for each order. Exclusive styles and replenishment programmes require their own agreement.',
      ),
    ],
  },
  development: {
    de: [
      section(
        'Ein definierter Einstieg in Ihr Produkt',
        'Ein Entwicklungsauftrag macht aus einer Idee eine prüfbare Grundlage. Design, Schnitt, Gradierung, Materialentwicklung und Muster werden nach tatsächlichem Bedarf beauftragt.',
        [
          'Vorhandene Tech-Packs, Zeichnungen und Referenzen prüfen',
          'Ergebnisse, Musteranzahl und Korrekturrunden vereinbaren',
          'Freigabekriterien und Übergabe der Unterlagen festlegen',
        ],
      ),
      section(
        'Entwicklung und Serie sauber kalkulieren',
        'Mustergebühren werden vor Arbeitsbeginn vereinbart. Eine mögliche Anrechnung auf einen späteren Serienauftrag braucht klare Bedingungen. Die Bezahlung eines Musters allein bestätigt weder Produktionskapazität noch Serienpreis oder Liefertermin.',
      ),
    ],
    en: [
      section(
        'A defined starting point for your product',
        'A development assignment turns an idea into something that can be reviewed. Design, patterns, grading, fabric development and samples are commissioned according to actual needs.',
        [
          'Review existing tech packs, drawings and references',
          'Agree deliverables, sample counts and revision rounds',
          'Define approval criteria and document handover',
        ],
      ),
      section(
        'Price development and bulk production separately',
        'Sampling fees are agreed before work starts. Any credit against a later bulk order needs explicit conditions. Paying for a sample does not itself confirm production capacity, bulk pricing or a delivery date.',
      ),
    ],
  },
  finishing: {
    de: [
      section(
        'Ihre Marke bis ins Detail',
        'Druck, Stick, Labels, Zubehör und Verpackung können einen Bekleidungsauftrag ergänzen oder als klar abgegrenzte Arbeit angefragt werden. Das Verfahren wird am konkreten Material und Motiv geprüft.',
        [
          'Artwork, Position, Abmessung und Farbe',
          'Labeltexte, Zubehör und Verpackungsvorgaben',
          'Musterfreigabe und vereinbarte Toleranzen',
        ],
      ),
      section(
        'Separat angebotene Arbeit',
        'Einrichtung, Muster und Stückkosten werden im Angebot nachvollziehbar getrennt, soweit sie anfallen. Bei beigestellten Textilien müssen Eignung, Anlieferung, Ausschussregelung und Verantwortung vorab geklärt werden.',
      ),
    ],
    en: [
      section(
        'Your brand in the details',
        'Printing, embroidery, labels, trims and packaging can support a garment order or be requested as separately scoped work. The process is checked against the actual fabric and artwork.',
        [
          'Artwork, position, dimensions and colour',
          'Label text, trims and packaging requirements',
          'Sample approval and agreed tolerances',
        ],
      ),
      section(
        'Separately quoted work',
        'Setup, samples and unit costs are identified in the quotation where applicable. Customer-supplied garments require prior agreement on suitability, delivery, spoilage and responsibilities.',
      ),
    ],
  },
  management: {
    de: [
      section(
        'Sie beauftragen die Fabrik. Wir koordinieren den definierten Umfang.',
        'Dieses Projektmandat richtet sich an Kunden, die den Warenvertrag direkt mit dem Hersteller schließen. TEXEVO übernimmt vereinbarte Aufgaben in Planung, Musterabstimmung, Produktionsverfolgung oder Übergabekoordination.',
        [
          'Meilensteine und Berichtstermine',
          'Verantwortliche für Freigaben und Änderungen',
          'Eskalation bei Abweichungen sowie Grenzen des Mandats',
        ],
      ),
      section(
        'Ein Projekt mit Anfang und Abschluss',
        'Der Auftrag legt Ergebnisse, Laufzeit, Honorar und Abnahme fest. Bei einer prozentualen Vergütung wird die Berechnungsgrundlage vereinbart. Für eine fortlaufende Betreuung mehrerer Programme ist ein monatliches Sourcing-Office-Mandat die passende Gesprächsgrundlage.',
      ),
    ],
    en: [
      section(
        'You contract the factory. We coordinate an agreed scope.',
        'This project mandate is for buyers who contract directly with the manufacturer for the goods. TEXEVO handles agreed planning, sample coordination, production follow-up or handover tasks.',
        [
          'Milestones and reporting dates',
          'Responsibilities for approvals and changes',
          'Escalation of deviations and limits of the mandate',
        ],
      ),
      section(
        'A project with a defined completion',
        'Agree deliverables, duration, fees and acceptance. Percentage fees require a specified calculation basis. For ongoing work across programmes, discuss a monthly sourcing-office mandate.',
      ),
    ],
  },
  quality: {
    de: [
      section(
        'Eine gesondert beauftragte Prüfung',
        'Unabhängige QC und technische Unterstützung werden mit eigenem Auftrag und abgegrenztem Umfang besprochen. Mögliche Aufgaben sind Inspektionen, Fabrikbewertungen und die Begleitung technischer Korrekturmaßnahmen.',
        [
          'Prüfgrundlage, Stichprobe und akzeptierte Kriterien',
          'Fachliche Zuständigkeit, Zugang und mögliche Interessenkonflikte',
          'Berichtsformat, Abweichungen und Nachprüfung',
        ],
      ),
      section(
        'Ein Bericht mit klaren Grenzen',
        'Prüferqualifikation und Unabhängigkeit sind vor Beauftragung zu bestätigen. Ein Ergebnis gilt für den dokumentierten Umfang und Zeitpunkt; es ist keine pauschale Zertifizierung, Laborprüfung oder Garantie einer gesamten Lieferkette.',
      ),
    ],
    en: [
      section(
        'A separately commissioned check',
        'Independent QC and technical support require a separate assignment with a defined scope. Potential tasks include inspections, factory assessments and support with technical corrective action.',
        [
          'Inspection basis, sampling and acceptance criteria',
          'Technical responsibility, access and potential conflicts of interest',
          'Report format, deviations and follow-up checks',
        ],
      ),
      section(
        'A report with clear limits',
        'Inspector competence and independence must be confirmed before engagement. Results apply to the documented scope and date; they are not a blanket certification, laboratory test or guarantee of an entire supply chain.',
      ),
    ],
  },
  logistics: {
    de: [
      section(
        'Die Übergabe mitplanen',
        'Packvorgaben, Kartonkennzeichnung, Mengenaufteilung und die Abstimmung der Lieferung können gesondert koordiniert werden. Der Umfang wird an Ihre Lager- oder Vertriebsvorgaben angepasst.',
        [
          'Packlisten und vereinbarte Verpackungseinheiten',
          'Kennzeichnung und Aufteilung nach Lieferort',
          'Abstimmung von Abholung, Übergabe und Dokumenten',
        ],
      ),
      section(
        'Zusatzleistungen ausdrücklich vereinbaren',
        'Koordination, Fracht, Versicherung und Importaufgaben sind getrennte Positionen. Zuständigkeiten und externe Kosten werden im Angebot benannt. Lagerhaltung, Zollvertretung oder Einzelkundenversand sind nur bei gesonderter Vereinbarung Teil des Auftrags.',
      ),
    ],
    en: [
      section(
        'Plan the handover',
        'Packing instructions, carton labels, quantity allocation and delivery arrangements can be coordinated separately. The scope follows your warehouse or distribution requirements.',
        [
          'Packing lists and agreed pack sizes',
          'Labelling and allocation by delivery location',
          'Collection, handover and document coordination',
        ],
      ),
      section(
        'Agree additional services explicitly',
        'Coordination, freight, insurance and import work are separate items. Responsibilities and external costs are identified in the quotation. Warehousing, customs representation and individual consumer fulfilment require a separate agreement.',
      ),
    ],
  },
}

export const businessPages: ContentRecord[] = (['de', 'en'] as const).flatMap((locale) => {
  const en = locale === 'en'
  const other: BusinessLocale = en ? 'de' : 'en'
  const base = { locale, status: 'illustrative' as const, author: 'TEXEVO · Redaktionsentwurf' }
  return [
    ...audiences.map((audience): ContentRecord => ({
      ...base,
      kind: 'page',
      slug: audience[locale].slug,
      title: audience[locale].label,
      description: audience[locale].description,
      eyebrow: en ? 'Who we work with' : 'Für wen wir arbeiten',
      translation: businessHref(audience, other),
      ctaLabel: en ? 'Discuss your garment programme' : 'Bekleidungsbedarf besprechen',
      ctaHref: enquiryHref(locale, 'supply', audience.id),
      sections: audienceDetails[audience.id][locale],
      related: [
        ...audience.services.map((id) => services.find((s) => s.id === id)![locale].slug),
        ...(!en && audience.id === 'uniform' ? ['teamkleidung'] : []),
      ],
    })),
    ...services
      .filter((service) => service.id !== 'office')
      .map((service): ContentRecord => ({
        ...base,
        kind: 'offer',
        slug: service[locale].slug,
        title: service[locale].label,
        description: service[locale].description,
        eyebrow:
          service.id === 'supply'
            ? en
              ? 'Our core business / B2B apparel'
              : 'Unser Schwerpunkt / B2B-Bekleidung'
            : en
              ? 'Supporting services'
              : 'Ergänzende Leistungen',
        translation: businessHref(service, other),
        ctaLabel: en ? 'Discuss this service' : 'Diese Leistung anfragen',
        ctaHref: enquiryHref(locale, service.id),
        sections: [
          ...serviceDetails[service.id][locale],
          section(
            en ? 'How it is quoted' : 'So wird die Leistung angeboten',
            service[locale].basis,
          ),
        ],
        related:
          service.id === 'supply'
            ? ['private-label', services[1][locale].slug, services[2][locale].slug]
            : [services[0][locale].slug, locale === 'de' ? 'leistungen' : 'services'],
      })),
    {
      ...base,
      kind: 'page' as const,
      slug: en ? 'customers' : 'kunden',
      title: en
        ? 'Different businesses. A clear apparel focus.'
        : 'Viele Geschäftsmodelle. Ein klarer Textilfokus.',
      eyebrow: en ? 'Our customers' : 'Unsere Kundengruppen',
      description: en
        ? 'Garment supply for established brands and the apparel trade is our focus. Selected retail and online programmes, uniforms and merchandise complete the offer.'
        : 'Bekleidung für etablierte Marken und den Textilhandel steht im Mittelpunkt. Ausgewählte Retail- und Online-Programme, Uniformen und Merchandise ergänzen das Angebot.',
      translation: `/${other}/${en ? 'kunden' : 'customers'}`,
      sections: [],
    },
    {
      ...base,
      kind: 'page' as const,
      slug: en ? 'services' : 'leistungen',
      title: en
        ? 'Garment supply. With the right support.'
        : 'Bekleidung liefern. Passend begleitet.',
      eyebrow: en ? 'Our services' : 'Unser Leistungsangebot',
      description: en
        ? 'Finished-garment sales are our main business. Development, finishing and defined sourcing, production, quality and delivery services support your programme.'
        : 'Der Verkauf fertiger Bekleidung ist unser Hauptgeschäft. Entwicklung, Veredelung sowie klar vereinbarte Sourcing-, Produktions-, Qualitäts- und Lieferleistungen unterstützen Ihr Vorhaben.',
      translation: `/${other}/${en ? 'leistungen' : 'services'}`,
      sections: [],
    },
  ]
})
