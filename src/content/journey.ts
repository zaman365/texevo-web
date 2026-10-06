import type { BusinessLocale } from './business'

type StageCopy = { title: string; short: string; text: string; output: string; decision: string }
export type ProductionStage = { id: string; service: string; de: StageCopy; en: StageCopy }
export const productionStages: ProductionStage[] = [
  {
    id: 'brief',
    service: 'supply',
    de: {
      title: 'Bedarf & Briefing',
      short: 'Briefing',
      text: 'Wir beginnen bei Ihrem Geschäft: Welche Produkte, für welchen Markt, in welchen Mengen? Vorhandene Unterlagen und offene Fragen werden in einem klaren Projektumfang zusammengeführt.',
      output: 'Produktgruppen, Mengenrahmen, Zielmarkt und offene Fragen.',
      decision: 'Gemeinsam klären, ob Warenlieferung oder ein separates Service-Mandat passt.',
    },
    en: {
      title: 'Requirements & brief',
      short: 'Brief',
      text: 'Start with your business: which products, for which market, in what quantities? Existing documents and open questions become a defined project scope.',
      output: 'Product categories, indicative quantities, destination market and open questions.',
      decision: 'Agree whether garment supply or a separate service mandate fits the project.',
    },
  },
  {
    id: 'development',
    service: 'development',
    de: {
      title: 'Produkt & Spezifikation',
      short: 'Entwicklung',
      text: 'Design, Schnitt, Maße und Gradierung werden auf den benötigten Entwicklungsstand gebracht. Bereits vorhandene Tech-Packs sind willkommen; fehlende Arbeit wird vorab abgegrenzt.',
      output: 'Vereinbarte Spezifikation und ein definiertes Entwicklungspaket.',
      decision: 'Entwicklungsbudget, Unterlagen und Korrekturrunden gemeinsam festlegen.',
    },
    en: {
      title: 'Product & specification',
      short: 'Development',
      text: 'Designs, patterns, measurements and grading are developed to the agreed level. Existing tech packs are welcome; any missing work is scoped before starting.',
      output: 'An agreed specification and a defined development package.',
      decision: 'Confirm the development budget, documentation and revision rounds.',
    },
  },
  {
    id: 'materials',
    service: 'office',
    de: {
      title: 'Material & Beschaffung',
      short: 'Material',
      text: 'Stoff, Farbe, Zubehör und Lieferweg müssen zum Produkt passen. Verfügbarkeit, technische Anforderungen und erforderliche Nachweise werden für die konkrete Auswahl geprüft.',
      output: 'Materialauswahl, Beschaffungsroute und zu prüfende Anforderungen.',
      decision: 'Freigegebene Materialien und verantwortliche Lieferpartner bestimmen.',
    },
    en: {
      title: 'Materials & sourcing',
      short: 'Materials',
      text: 'Fabric, colour, trims and the supply route need to fit the product. Availability, technical requirements and necessary evidence are checked for the specific selection.',
      output: 'Material choices, a sourcing route and requirements to verify.',
      decision: 'Confirm approved materials and responsible supply partners.',
    },
  },
  {
    id: 'samples',
    service: 'development',
    de: {
      title: 'Muster & Freigabe',
      short: 'Muster',
      text: 'Ein physisches Muster macht Passform, Griff und Verarbeitung prüfbar. Kommentare, Änderungen und der freigegebene Stand werden als Referenz für den nächsten Schritt dokumentiert.',
      output: 'Musterreferenz, dokumentierte Kommentare und Freigabeumfang.',
      decision: 'Sie prüfen das Muster und bestätigen die vereinbarten Produktionsmerkmale.',
    },
    en: {
      title: 'Samples & approval',
      short: 'Samples',
      text: 'A physical sample makes fit, feel and construction tangible. Comments, changes and the approved version are documented as the reference for the next step.',
      output: 'A sample reference, documented comments and the approval scope.',
      decision: 'You review the sample and confirm the agreed production characteristics.',
    },
  },
  {
    id: 'production',
    service: 'supply',
    de: {
      title: 'Produktion & Ausstattung',
      short: 'Produktion',
      text: 'Die Serie folgt dem vereinbarten Auftrag und der freigegebenen Referenz. Druck, Stick, Labels und Verpackung werden einbezogen, soweit beauftragt. Änderungen benötigen eine neue Abstimmung.',
      output: 'Ein bestätigter Auftrag mit Mengen, Ausstattung und vereinbarten Meilensteinen.',
      decision: 'Umfang, Preis und Termin vor Produktionsbeginn schriftlich bestätigen.',
    },
    en: {
      title: 'Production & finishing',
      short: 'Production',
      text: 'The production run follows the agreed order and approved reference. Printing, embroidery, labels and packaging are included where commissioned. Changes require renewed agreement.',
      output: 'A confirmed order with quantities, finishing and agreed milestones.',
      decision: 'Confirm scope, price and timing in writing before production starts.',
    },
  },
  {
    id: 'quality',
    service: 'quality',
    de: {
      title: 'Qualität & Dokumentation',
      short: 'Qualität',
      text: 'Prüfkriterien, Stichproben und Verantwortlichkeiten werden vorab vereinbart. Festgestellte Abweichungen und notwendige Korrekturen werden nachvollziehbar festgehalten.',
      output: 'Prüfergebnisse im vereinbarten Umfang und dokumentierte offene Punkte.',
      decision:
        'Prüfanforderungen und den Umgang mit Abweichungen bestätigen; unabhängige QC separat beauftragen.',
    },
    en: {
      title: 'Quality & documentation',
      short: 'Quality',
      text: 'Inspection criteria, sampling and responsibilities are agreed in advance. Findings and any necessary corrections are recorded against that scope.',
      output: 'Inspection results within the agreed scope and documented open issues.',
      decision:
        'Confirm inspection requirements and how deviations are handled; commission independent QC separately.',
    },
  },
  {
    id: 'delivery',
    service: 'logistics',
    de: {
      title: 'Lieferung & nächste Bestellung',
      short: 'Lieferung',
      text: 'Verpackung, Lieferbedingungen und Übergabe werden abgestimmt. Die dokumentierte Artikel- und Musterreferenz bleibt die Grundlage für mögliche Folgeaufträge.',
      output: 'Vereinbarte Übergabe und eine Referenz für die Nachbestellung.',
      decision: 'Für Folgeaufträge Mengen, Verfügbarkeit, Konditionen und Liefertermin neu prüfen.',
    },
    en: {
      title: 'Delivery & repeat orders',
      short: 'Delivery',
      text: 'Packing, delivery terms and handover are agreed. The documented product and sample reference provides a starting point for future orders.',
      output: 'An agreed handover and a reference for repeat orders.',
      decision: 'Reconfirm quantities, availability, terms and delivery dates for each new order.',
    },
  },
]

export const buyerQuestions: Record<BusinessLocale, { question: string; answer: string }[]> = {
  de: [
    {
      question: 'Kaufen wir Bekleidung oder beauftragen wir einen Service?',
      answer:
        'Beides ist möglich. Bei einer Bekleidungslieferung kaufen Sie die vereinbarte Ware von TEXEVO zum angebotenen Stückpreis. Bei einem Sourcing- oder Produktionsmandat beauftragen Sie die Fabrik direkt und bezahlen TEXEVO für den definierten Service. Vertragsparteien und Leistungen werden vorab geklärt.',
    },
    {
      question: 'Welche Mindestmengen sind möglich?',
      answer:
        'Das hängt von Produkt, Material, Veredelung und Produktionsroute ab. Nennen Sie Ihre geplante Menge je Modell, Farbe und Größe. Erst nach der Machbarkeitsprüfung können Mindestmengen und Konditionen bestätigt werden. Eine pauschale Mindestmenge gilt nicht für alle Projekte.',
    },
    {
      question: 'Brauchen wir bereits ein vollständiges Tech-Pack?',
      answer:
        'Nein. Eine Produktidee, ein Referenzmuster oder vorhandene Unterlagen können den Einstieg bilden. Wir grenzen ab, was noch entwickelt werden muss, und vereinbaren Muster, Ergebnisse und Gebühren vor Beginn. Eine mögliche Anrechnung auf den Serienauftrag wird gesondert vereinbart.',
    },
    {
      question: 'Wie werden Preis und Liefertermin bestimmt?',
      answer:
        'Spezifikation, Mengen, Musterstufen, Materialverfügbarkeit, Ausstattung und Lieferbedingungen bestimmen die Kalkulation. Sie erhalten projektbezogene Konditionen nach Prüfung. Ein Beispielablauf auf dieser Website ist keine feste Lieferzeit oder Kapazitätszusage.',
    },
    {
      question: 'Wie werden Qualität und Nachweise behandelt?',
      answer:
        'Prüfanforderungen gehören in das Briefing. Musterfreigaben, vereinbarte Kontrollen und dokumentierte Abweichungen schaffen eine gemeinsame Referenz. Produkt- oder Lieferantennachweise müssen zum tatsächlichen Auftrag passen. Unabhängige QC und technische Prüfungen brauchen einen gesondert bestätigten Umfang.',
    },
    {
      question: 'Sind Nachlieferungen und laufende Betreuung möglich?',
      answer:
        'Wiederkehrende Belieferung kann auf einer dokumentierten Artikelreferenz aufbauen. Konditionen und Verfügbarkeit werden pro Bestellung neu bestätigt. Für eine fortlaufende Lieferanten- oder Produktionsbetreuung lässt sich alternativ ein Sourcing-Office-Mandat mit monatlichem Honorar vereinbaren.',
    },
  ],
  en: [
    {
      question: 'Do we buy garments or commission a service?',
      answer:
        'Both routes are possible. For garment supply, you buy the agreed goods from TEXEVO at the quoted unit price. For a sourcing or production mandate, you contract the factory directly and pay TEXEVO for a defined service. Contracting parties and scope are agreed in advance.',
    },
    {
      question: 'What minimum quantities are possible?',
      answer:
        'Quantities depend on the product, fabric, finishing and production route. Share your planned volume per style, colour and size. Minimums and terms can only be confirmed after feasibility review; one universal minimum does not apply to every project.',
    },
    {
      question: 'Do we need a complete tech pack to start?',
      answer:
        'No. A product idea, reference sample or existing documents can start the discussion. We define the development still needed and agree samples, deliverables and fees before beginning. Any credit against a bulk order is agreed separately.',
    },
    {
      question: 'How are prices and delivery dates established?',
      answer:
        'Specifications, volumes, sample rounds, material availability, finishing and delivery terms determine the quotation. Project-specific terms follow a feasibility review. An example workflow on this website is not a fixed lead time or a capacity commitment.',
    },
    {
      question: 'How are quality requirements and evidence handled?',
      answer:
        'Include inspection requirements in the brief. Sample approvals, agreed checks and documented deviations establish a shared reference. Product and supplier evidence must apply to the actual order. Independent QC and technical testing need a separately confirmed scope.',
    },
    {
      question: 'Can we arrange repeat supply or ongoing support?',
      answer:
        'Repeat supply can build on a documented product reference. Terms and availability are reconfirmed for each order. Alternatively, a monthly sourcing-office mandate can cover ongoing support for a defined supplier portfolio or production programme.',
    },
  ],
}
