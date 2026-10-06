import type { ContentRecord, ContentSection } from './types'
import { businessPages } from './business-pages'

const section = (heading: string, text: string, items?: string[]): ContentSection => ({
  heading,
  text,
  items,
})
const entry = (record: ContentRecord): ContentRecord => ({
  status: 'illustrative',
  author: 'TEXEVO · Redaktionsentwurf',
  ...record,
})

export const seedContent: ContentRecord[] = [
  ...businessPages,
  entry({
    locale: 'de',
    kind: 'offer',
    slug: 'teamkleidung',
    eyebrow: 'Teams & Corporate Wear',
    title: 'Ein Team. Viele Größen. Ein klarer Plan.',
    description:
      'Polos, Shirts und Hoodies für den Arbeitsalltag, Veranstaltungen und neue Kolleginnen und Kollegen. Auch eine Anfrage um 100 Stück ist ein guter Ausgangspunkt.',
    ctaLabel: 'Teamkleidung anfragen',
    ctaHref: '/de/anfrage?category=team&audience=uniform&service=supply',
    related: [
      'kunden/uniformen-corporate',
      'kunden/merchandise-community',
      'veredelung',
      'wissen/groessen-erfassen',
    ],
    sections: [
      section(
        'Vom Einsatz zum passenden Textil',
        'Wie häufig wird das Kleidungsstück getragen und gewaschen? Soll es im Büro, bei Veranstaltungen oder in der Werkstatt eingesetzt werden? Diese Fragen kommen vor der Modellwahl. Wir sprechen hier über normale Bekleidung; eine Schutzwirkung wird nicht zugesagt.',
      ),
      section(
        'Lagerware mit Ihrer Veredelung',
        'Ein vorhandenes Modell kann ein sinnvoller Start sein. Verfügbarkeit, Größen, Farben und die passende Veredelung werden für Ihre konkrete Anfrage geprüft. Es gibt keine pauschale Mindestmenge oder Lieferzusage.',
        [
          'Einsatz, ungefähre Menge und Wunschtermin nennen',
          'Passform und Größen mit einem Muster prüfen',
          'Logo, Position und Ausführung freigeben',
          'Angebot und Lieferbedingungen schriftlich abstimmen',
        ],
      ),
      section(
        'Eine Referenz für das nächste Mal',
        'Freigegebene Artikel, Größen, Farben und Artwork sollten als Referenz dokumentiert werden. Bei einer Nachbestellung werden Verfügbarkeit, Preis, Farbpartie und Termin erneut geprüft.',
      ),
    ],
  }),
  entry({
    locale: 'de',
    kind: 'offer',
    slug: 'private-label',
    eyebrow: 'Bekleidungslieferung / Private Label',
    title: 'Ihre Kollektion. Von der Idee bis zur Lieferung.',
    description:
      'Private-Label-Kollektionen und individuelle Bekleidung für Marken und Handel. Entwicklung und Muster bereiten den Warenauftrag vor; wiederkehrende Belieferung wird projektbezogen vereinbart.',
    ctaLabel: 'Produktionsprojekt beschreiben',
    ctaHref: '/de/anfrage?category=production&service=supply',
    translation: '/en/private-label',
    related: ['bekleidungslieferung', 'produktentwicklung', 'kunden/modemarken'],
    sections: [
      section(
        'Entwicklung und Produktion getrennt betrachten',
        'Ein Referenzmuster ist noch keine fertige Produktionsspezifikation. Schnitte, Maße, Toleranzen, Materialien, Zubehör und Verpackung müssen abgestimmt werden. Notwendige Entwicklungsleistungen werden vorab beschrieben und separat vereinbart.',
      ),
      section(
        'Was Ihr erstes Briefing enthalten sollte',
        'Auch ein unvollständiges Briefing hilft. Kennzeichnen Sie offene Punkte, statt vermeintliche Sicherheit herzustellen.',
        [
          'Produktkategorie und Anzahl der Modelle',
          'Menge je Modell, Farbe und Größe',
          'Tech-Pack oder Referenzmuster, falls vorhanden',
          'Zielmarkt, Prüfanforderungen und gewünschter Termin',
          'Entwicklungsbudget und vorgesehene Freigaben',
        ],
      ),
      section(
        'Eine passende Route finden',
        'Bangladesch kann für geeignete Programme eine Beschaffungsoption sein. Die konkrete Fabrik, fachliche Zuständigkeit und Durchführbarkeit müssen pro Projekt geprüft werden. TEXEVO behauptet keine eigene Produktionsstätte und verspricht keine ungeprüfte Kapazität.',
      ),
    ],
  }),
  entry({
    locale: 'de',
    kind: 'offer',
    slug: 'sourcing-office',
    eyebrow: 'Laufende Sourcing- & Produktionsbegleitung',
    title: 'Ein klarer Auftrag für Ihre Beschaffung.',
    description:
      'Ein monatliches Mandat für ein definiertes Lieferantenportfolio, eine Warengruppe oder ein Produktionsprogramm. Aufgaben, Berichte und Zuständigkeiten werden vor dem Start vereinbart.',
    ctaLabel: 'Sourcing-Bedarf besprechen',
    ctaHref: '/de/anfrage?category=sourcing&service=office',
    translation: '/en/sourcing-office',
    related: ['produktionsmanagement', 'qualitaetssicherung', 'bekleidungslieferung'],
    sections: [
      section(
        'Laufende Betreuung mit Monatsbudget',
        'Ein monatliches Honorar deckt den vereinbarten Umfang für Lieferantenportfolio, Kategorie oder Produktionsprogramm ab. Aufgaben, Ansprechpartner, Berichtstakt, Laufzeit und Zusatzleistungen werden vor Beginn festgelegt. Ein einzelnes Vorhaben kann stattdessen als Projektmandat vereinbart werden.',
      ),
      section(
        'Wer kauft bei wem?',
        'Beim Dienstleistungsmandat schließen Sie den Warenvertrag mit dem vereinbarten Lieferanten. TEXEVO erhält ein gesondert vereinbartes Honorar für die beschriebenen Leistungen. Beim Produktkauf von TEXEVO gelten andere Verantwortlichkeiten; beide Modelle werden nicht vermischt.',
      ),
      section(
        'Der Leistungsumfang entscheidet',
        'Lieferantensuche, Musterkoordination, Fortschrittsberichte und Qualitätskontrollen sind unterschiedliche Aufgaben. Umfang, Berichtstermine, Zugang zu Unterlagen und Grenzen der Kontrolle gehören in den Auftrag.',
        [
          'Bestehende Lieferanten und aktueller Projektstand',
          'Konkrete Lücke im eigenen Beschaffungsteam',
          'Benötigte lokale oder technische Betreuung',
          'Vertragsparteien, Vergütung und Eskalationsweg',
        ],
      ),
      section(
        'Transparente Interessen',
        'Vergütung und etwaige Provisionen werden offengelegt und vertraglich geklärt. Ein Bericht ersetzt keine unabhängige Prüfung, wenn diese für Ihr Produkt oder Ihren Markt erforderlich ist.',
      ),
    ],
  }),
  entry({
    locale: 'de',
    kind: 'page',
    slug: 'so-arbeiten-wir',
    eyebrow: 'Von der Frage zur Freigabe',
    title: 'Gute Textilien beginnen mit guten Entscheidungen.',
    description:
      'Material, Passform und Veredelung gehören zusammen. Ein dokumentierter Ablauf macht offene Punkte und Verantwortlichkeiten sichtbar.',
    related: ['muster', 'nachweise', 'wissen/musterfreigabe'],
    sections: [
      section(
        '01 — Bedarf verstehen',
        'Einsatz, Menge, Termin und Rahmenbedingungen ergeben das Briefing. Wenn etwas offen ist, wird es als offene Frage festgehalten.',
      ),
      section(
        '02 — Auswahl prüfen',
        'Modelle, Material und Veredelung werden auf den Einsatz abgestimmt. Ein physisches Muster hilft, Passform, Griff und Ausführung zu beurteilen.',
      ),
      section(
        '03 — Freigabe dokumentieren',
        'Artikel, Maße, Farbe, Artwork, Position, Musterstand und erlaubte Abweichungen werden eindeutig festgehalten. Änderungen nach der Freigabe benötigen eine neue Abstimmung.',
      ),
      section(
        '04 — Lieferung und Referenz',
        'Lieferumfang und Abweichungen werden dokumentiert. Eine spätere Nachbestellung beginnt mit dieser Referenz und einer neuen Prüfung der Konditionen.',
      ),
    ],
  }),
  entry({
    locale: 'de',
    kind: 'page',
    slug: 'muster',
    eyebrow: 'Erst in die Hand nehmen',
    title: 'Ein Muster klärt mehr als ein Bildschirm.',
    description:
      'Passform, Griff und Farbe lassen sich am besten am tatsächlichen Textil besprechen. Beschreiben Sie uns, was Sie prüfen möchten.',
    ctaLabel: 'Musterbedarf anfragen',
    ctaHref: '/de/anfrage?category=sample',
    sections: [
      section(
        'Was soll das Muster beantworten?',
        'Geht es um Größen, Material, Waschverhalten oder die Wirkung des Logos? Ein gut eingegrenztes Prüfziel hilft bei der Auswahl.',
      ),
      section(
        'Inhalt und Konditionen vorab vereinbaren',
        'Es gibt in dieser Vorschau kein buchbares Standard-Musterpaket. Verfügbare Modelle, Kosten, mögliche Anrechnung, Versand und Rückgabe werden vor einem Versand schriftlich abgestimmt.',
      ),
      section(
        'Das Ergebnis festhalten',
        'Notieren Sie Modell, Größe, Ausführung und Datum. Fotografieren Sie relevante Details und benennen Sie, welche Punkte freigegeben sind und welche noch offen bleiben.',
      ),
    ],
  }),
  entry({
    locale: 'de',
    kind: 'page',
    slug: 'nachweise',
    eyebrow: 'Aussagen mit Geltungsbereich',
    title: 'Ein Nachweis muss zum Produkt passen.',
    description:
      'Eine Bescheinigung zu einem Material oder Lieferanten ist keine pauschale Aussage über jedes Produkt. Hier werden freigegebene Nachweise mit ihrem Geltungsbereich veröffentlicht.',
    sections: [
      section(
        'Noch keine Nachweise veröffentlicht',
        'Es liegen für diese Vorschau keine freigegebenen Zertifikate, Lieferantenberichte oder Kundenreferenzen vor. Deshalb werden keine Zertifizierungszeichen oder Kundenlogos gezeigt.',
      ),
      section(
        'Was ein Nachweis enthalten soll',
        'Dokumenttyp, Aussteller, betroffener Artikel oder Charge, Fassung, Prüfdatum, Gültigkeit und verantwortliche Stelle gehören zusammen. Vertrauliche Originale werden nicht öffentlich bereitgestellt.',
        [
          'Produkt- und Chargenbezug',
          'Nachvollziehbarer Geltungsbereich',
          'Gültigkeit und Datum der Prüfung',
          'Freigabe zur Veröffentlichung',
        ],
      ),
      section(
        'Den Prozess ansehen',
        'Die zwei Prozessbeispiele zeigen die Struktur einer Freigabe. Sie sind ausdrücklich Demonstrationen und belegen keine ausgeführten Kundenaufträge.',
      ),
    ],
  }),
  entry({
    locale: 'de',
    kind: 'page',
    slug: 'partner',
    eyebrow: 'Für Agenturen und Veredler',
    title: 'Zusammenarbeiten. Zuständigkeiten behalten.',
    description:
      'Für Druckereien, Werbemittelagenturen und Partner, die textile Anfragen gemeinsam bearbeiten möchten.',
    ctaLabel: 'Partneranfrage stellen',
    ctaHref: '/de/anfrage?category=partner',
    sections: [
      section(
        'Ihre Kundenbeziehung ist Teil des Briefings',
        'Vor dem ersten Angebot werden Kontaktwege, Auftritt gegenüber dem Endkunden, Datenzugang und Verantwortlichkeiten festgehalten. White-Label-Verpackung wird nur nach konkreter Prüfung zugesagt.',
      ),
      section(
        'Ein Pilot statt pauschaler Versprechen',
        'Ein abgegrenztes erstes Projekt zeigt, ob Ablauf und wirtschaftlicher Rahmen passen. Konditionen hängen von Umfang und Leistungen ab; ein allgemeiner Händlerrabatt wird nicht versprochen.',
      ),
    ],
  }),
  entry({
    locale: 'de',
    kind: 'page',
    slug: 'ueber-uns',
    eyebrow: 'TEXEVO / Im Aufbau',
    title: 'Textilien brauchen Menschen, die nachfragen.',
    description:
      'TEXEVO wird als B2B-Textilangebot mit geplanter kaufmännischer Präsenz in Chemnitz entwickelt. Der Anspruch: Entscheidungen verständlich machen und Vereinbarungen nachvollziehbar dokumentieren.',
    sections: [
      section(
        'Verantwortung sichtbar machen',
        'Der Aufbau verbindet kaufmännische und digitale Abläufe mit projektbezogener Textilkompetenz. Namen, Biografien, konkrete Partnerrollen und Fotos werden erst nach persönlicher Freigabe veröffentlicht.',
      ),
      section(
        'Ein fokussierter Start',
        'Im Mittelpunkt steht der Verkauf fertiger Bekleidung an etablierte europäische Modemarken, Importeure, Großhändler und Distributoren. Ausgewählte Retail- und Online-Programme, Uniformen und Merchandise ergänzen das Angebot. Entwicklung, Veredelung sowie laufende oder projektbezogene Sourcing- und Produktionsleistungen werden separat vereinbart.',
      ),
      section(
        'Was noch aussteht',
        'Handelsname, rechtliche Unternehmensdaten, Kontaktkanäle und Lieferantenfreigaben sind für diese Vorschau noch zu bestätigen. Diese Website ist noch kein öffentlich freigegebenes Lieferangebot.',
      ),
    ],
  }),
  entry({
    locale: 'de',
    kind: 'knowledge',
    slug: 'wissen/100-poloshirts',
    eyebrow: 'Einkauf vorbereiten',
    title: '100 Poloshirts mit Logo: Was gehört in die Anfrage?',
    description:
      'Für ein belastbares Angebot braucht es mehr als Stückzahl und Logo. Diese Angaben helfen, ohne dass schon jedes Detail feststehen muss.',
    readingMinutes: 4,
    related: ['teamkleidung', 'downloads/groessenliste', 'wissen/logo-dateien'],
    sections: [
      section(
        'Mit dem Einsatz beginnen',
        'Beschreiben Sie, wer das Polo trägt und wie es genutzt wird. Täglicher Einsatz mit häufigem Waschen führt zu anderen Fragen als ein einzelner Messetag. Falls gewerbliche Reinigung vorgesehen ist, müssen Modell und Pflegeverfahren dazu passen.',
      ),
      section(
        'Menge und Verteilung trennen',
        'Nennen Sie die Gesamtzahl und die geplante Verteilung nach Größen und Farben. „100 Stück, Größen noch offen“ reicht als Anfang. Eine feste Größenliste und aktuelle Verfügbarkeit werden vor dem Auftrag benötigt.',
      ),
      section(
        'Die Veredelung konkret machen',
        'Wo soll das Logo sitzen? Wie groß soll es wirken? Liegt eine Vektordatei vor? Beschreiben Sie Position und gewünschte Wirkung; die technische Machbarkeit wird am Textil geprüft.',
      ),
      section(
        'Termin und Lieferziel nennen',
        'Unterscheiden Sie Ihren Veranstaltungstermin vom gewünschten Wareneingang. Muster, Artwork-Freigabe und Transport brauchen Zeit. Erst ein bestätigter Ablauf ist eine Liefervereinbarung.',
        [
          'Einsatz und gewünschtes Kleidungsstück',
          'Gesamtmenge, Größen und Farben – soweit bekannt',
          'Logo, Position und ungefähre Abmessung',
          'Lieferziel und gewünschter Wareneingang',
          'Budgetrahmen, wenn bereits abgestimmt',
        ],
      ),
    ],
  }),
  entry({
    locale: 'de',
    kind: 'knowledge',
    slug: 'wissen/stick-oder-druck',
    eyebrow: 'Veredelung verstehen',
    title: 'Stick oder Druck? Zuerst auf Stoff und Motiv schauen.',
    description:
      'Die passende Veredelung hängt vom Textil, von der Detailtiefe des Logos und von der Nutzung ab. Ein Muster macht den Unterschied sichtbar.',
    readingMinutes: 4,
    related: ['materialien/stick', 'materialien/textildruck', 'muster'],
    sections: [
      section(
        'Stick braucht eine geeignete Grundlage',
        'Stick kann auf geeigneten Textilien eine plastische Wirkung erzielen. Kleine Schrift, dichte Flächen und sehr leichte Stoffe können schwierig sein. Unterlage, Stichdichte und Ausführung müssen zum Material passen.',
      ),
      section(
        'Druck ist kein einzelnes Verfahren',
        'Siebdruck, Transfer und andere Verfahren unterscheiden sich in Griff, Detailwiedergabe und Verarbeitung. Die Auswahl braucht Angaben zu Faser, Oberfläche, Motiv und Menge. Eine allgemeine Haltbarkeitszusage wäre irreführend.',
      ),
      section(
        'Ein Freigabemuster klärt die Erwartung',
        'Prüfen Sie Größe, Position, Farben, Haptik und sichtbare Details. Vereinbaren Sie die Pflegebedingungen und bei Bedarf einen passenden Waschversuch. Ein digitales Bild ist kein physisches Druck- oder Stickmuster.',
      ),
    ],
  }),
  entry({
    locale: 'de',
    kind: 'knowledge',
    slug: 'wissen/groessen-erfassen',
    eyebrow: 'Teamorganisation',
    title: 'Größen erfassen, ohne dreimal nachzufragen.',
    description:
      'Eine gemeinsame Modellreferenz und eine einfache Mengenliste ersparen Missverständnisse. Für das Angebot sind aggregierte Größen meist ausreichend.',
    readingMinutes: 3,
    related: ['downloads/groessenliste', 'muster', 'teamkleidung'],
    sections: [
      section(
        'Ein Modell als gemeinsame Grundlage',
        'Eine Größe M fällt nicht bei jedem Modell gleich aus. Teilen Sie die Größentabelle des ausgewählten Artikels und vereinbaren Sie, wie gemessen wird. Bei Unsicherheit hilft eine Anprobe mit echten Mustern.',
      ),
      section(
        'Nur benötigte Daten sammeln',
        'Für die Beschaffung genügt häufig die Summe pro Größe, Modell und Standort. Persönliche Mitarbeiterdaten müssen nicht in einer Lieferantenanfrage stehen. Klären Sie intern, wer die Verteilung organisiert.',
      ),
      section(
        'Eine Fassung verbindlich machen',
        'Benennen Sie eine zuständige Person und eine Frist. Prüfen Sie, ob die Summe der Größen der bestellten Menge entspricht. Änderungen erhalten eine neue Fassung, damit nicht parallel mit verschiedenen Listen gearbeitet wird.',
      ),
    ],
  }),
  entry({
    locale: 'de',
    kind: 'knowledge',
    slug: 'wissen/musterfreigabe',
    eyebrow: 'Freigaben organisieren',
    title: 'Musterfreigabe: Was vor der Produktion feststehen sollte.',
    description:
      'Eine Freigabe muss erkennen lassen, welches Muster und welche Eigenschaften akzeptiert wurden. „Sieht gut aus“ lässt zu viele Fragen offen.',
    readingMinutes: 5,
    related: ['downloads/mustercheckliste', 'so-arbeiten-wir', 'projekte/freigabe-beispiel'],
    sections: [
      section(
        'Das Muster eindeutig benennen',
        'Artikel, Material, Farbe, Größe und Musterfassung gehören in die Dokumentation. Wenn ein Detail nur auf einem Foto gezeigt wurde, sollte auch diese Einschränkung erkennbar bleiben.',
      ),
      section(
        'Eigenschaften einzeln prüfen',
        'Maße, Toleranzen, Verarbeitung, Artwork, Position, Zubehör und Verpackung sind unterschiedliche Prüfpunkte. Halten Sie Abweichungen und noch ausstehende Prüfungen separat fest.',
      ),
      section(
        'Freigabe und Änderung verbinden',
        'Notieren Sie Datum, zuständige Person und den ausdrücklich freigegebenen Umfang. Ändern sich relevante Daten, muss geprüft werden, ob eine neue Freigabe nötig ist. Die rechtliche Bedeutung wird im konkreten Auftrag vereinbart.',
        [
          'Eindeutige Muster- und Dokumentnummer',
          'Prüfumfang und vereinbarte Toleranzen',
          'Offene Punkte und Verantwortliche',
          'Datum, Person und freigegebene Fassung',
        ],
      ),
    ],
  }),
  entry({
    locale: 'de',
    kind: 'knowledge',
    slug: 'wissen/lagerware-oder-produktion',
    eyebrow: 'Beschaffungswege',
    title: 'Lagerware veredeln oder individuell produzieren?',
    description:
      'Die Frage ist nicht, welcher Weg grundsätzlich besser ist. Entscheidend sind Gestaltung, Menge, Zeit und Entwicklungsaufwand.',
    readingMinutes: 4,
    related: ['teamkleidung', 'private-label', 'journal/zwei-wege'],
    sections: [
      section(
        'Vorhandene Modelle als Ausgangspunkt',
        'Wenn Schnitt, Farbe und Material bereits passen, kann die Veredelung eines vorhandenen Artikels sinnvoll sein. Abhängigkeiten bleiben: Größenverfügbarkeit, Wiederbeschaffung, Logoausführung und Liefertermin müssen aktuell geprüft werden.',
      ),
      section(
        'Sonderproduktion braucht mehr Entscheidungen',
        'Ein eigener Schnitt, spezielle Materialien oder Konstruktionen führen zu mehr Entwicklung und Abstimmung. Mengen je Farbe und Modell, Bemusterung, Prüfungen und Transport beeinflussen die Wirtschaftlichkeit.',
      ),
      section(
        'Gesamten Aufwand vergleichen',
        'Vergleichen Sie nicht nur einen Stückpreis. Entwicklung, Muster, Veredelung, Prüfung, Transport, Einfuhr und die gebundene Liquidität können relevant sein. Ohne konkrete Spezifikation ist eine Zahl nur eine Annahme.',
      ),
    ],
  }),
  entry({
    locale: 'de',
    kind: 'knowledge',
    slug: 'wissen/logo-dateien',
    eyebrow: 'Artwork vorbereiten',
    title: 'Logo-Dateien für Textilien: Was wird benötigt?',
    description:
      'Eine geeignete Datei erleichtert die Umsetzung. Sie ersetzt aber nicht die Prüfung von Farbe, Größe und Position am tatsächlichen Textil.',
    readingMinutes: 3,
    related: ['downloads/artworkcheckliste', 'wissen/stick-oder-druck', 'teamkleidung'],
    sections: [
      section(
        'Originaldatei und Vorschau unterscheiden',
        'Eine Vektordatei kann Konturen unabhängig von der Ausgabegröße beschreiben. Eine Bilddatei muss für die gewünschte Größe ausreichend aufgelöst sein. Ein Logo aus einer E-Mail-Signatur reicht häufig nicht für die Produktion.',
      ),
      section(
        'Farbe und Position beschreiben',
        'Nennen Sie vorhandene Farbreferenzen und die gewünschte Abmessung. Bildschirmfarben sind keine verbindliche Materialfarbe. Bei Stick oder Druck können technische Anpassungen nötig werden.',
      ),
      section(
        'Rechte und sichere Übergabe',
        'Sie müssen die erforderlichen Nutzungsrechte am Motiv haben. Die Anfrage nimmt optional PDF, PNG und JPEG an. Produktionsoriginale in anderen Formaten werden nach Abstimmung über einen geeigneten Kanal übergeben. Dateien bleiben bis zur Sicherheitsprüfung gesperrt.',
      ),
    ],
  }),
  entry({
    locale: 'de',
    kind: 'journal',
    slug: 'journal/wenige-modelle',
    eyebrow: 'Notizen aus dem Aufbau / 01',
    title: 'Warum wir mit wenigen Modellen starten.',
    description:
      'Eine kurze Auswahl ist nur dann hilfreich, wenn die Unterschiede verständlich werden. Unsere geplante Auswahl beginnt mit Einsatzfragen.',
    readingMinutes: 3,
    sections: [
      section(
        'Nicht jede Variante schafft Orientierung',
        'Mehr Modelle bedeuten mehr Unterschiede bei Passform, Pflege und Verfügbarkeit. Wer Teamkleidung beschafft, braucht eine begründete Vorauswahl und nachvollziehbare Alternativen.',
      ),
      section(
        'Erst prüfen, dann empfehlen',
        'Die Vorschau zeigt deshalb Produktprofile statt erfundener Artikelnummern. Bevor daraus ein Angebot wird, werden Lieferantendaten, Muster und Bildrechte ergänzt und geprüft.',
      ),
      section(
        'Auswahl bleibt projektbezogen',
        'Die passende Empfehlung entsteht aus dem konkreten Einsatz. Ein einmal ausgewähltes Modell ist kein Versprechen unbegrenzter Verfügbarkeit. Eine dokumentierte Alternative gehört zur Planung.',
      ),
    ],
  }),
  entry({
    locale: 'de',
    kind: 'journal',
    slug: 'journal/zwei-wege',
    eyebrow: 'Notizen aus dem Aufbau / 02',
    title: 'Ein Produktgedanke. Zwei Beschaffungswege.',
    description:
      'Ein illustriertes Entscheidungsszenario: Ein Team benötigt ein Polo. Was ändert sich, wenn ein eigener Schnitt wichtig wird?',
    readingMinutes: 3,
    sections: [
      section(
        'Ausgangslage — ein Planungsbeispiel',
        'Ein Unternehmen möchte ein Polo mit eigenem Logo. Menge, Termin und Budget sind noch offen. Dieses Beispiel beschreibt keinen ausgeführten Kundenauftrag.',
      ),
      section(
        'Weg eins: ein vorhandenes Modell',
        'Wenn der Schnitt passt, stehen Auswahl, Größen und Veredelung im Mittelpunkt. Der nächste sinnvolle Schritt ist ein Muster des tatsächlichen Artikels.',
      ),
      section(
        'Weg zwei: eine eigene Konstruktion',
        'Wenn Schnitt und Details individuell sein müssen, kommen Entwicklung und weitere Freigaben hinzu. Erst die Spezifikation erlaubt die Suche nach einer passenden Produktionsroute. Beide Wege brauchen eine konkrete Machbarkeitsprüfung.',
      ),
    ],
  }),
  entry({
    locale: 'de',
    kind: 'journal',
    slug: 'journal/gute-freigabe',
    eyebrow: 'Notizen aus dem Aufbau / 03',
    title: 'Eine gute Freigabe macht offene Fragen sichtbar.',
    description:
      'Unser Arbeitsprinzip für den Aufbau: Nicht alles muss sofort beantwortet sein. Es muss aber klar sein, wer den nächsten Punkt klärt.',
    readingMinutes: 3,
    sections: [
      section(
        'Unbekannt ist eine nützliche Information',
        'Eine noch offene Farbdefinition sollte im Briefing erkennbar sein. Wird sie durch eine willkürliche Annahme ersetzt, kann diese unbemerkt zur Grundlage einer Kalkulation werden.',
      ),
      section(
        'Ein Dokument, eine Fassung',
        'Eine übersichtliche Referenz verbindet Entscheidungen und offene Punkte. Änderungen werden datiert, statt stillschweigend in eine alte Freigabe übernommen.',
      ),
      section(
        'Der nächste Schritt muss klein genug sein',
        'Manchmal reicht eine konkrete Rückfrage. Manchmal braucht es ein echtes Muster. Der Prozess sollte diese Entscheidung erleichtern, statt jede Anfrage sofort in einen verbindlichen Auftrag zu drängen.',
      ),
    ],
  }),
  ...[
    [
      'pique',
      'Piqué',
      'Die strukturierte Oberfläche vieler Poloshirts.',
      'Piqué bezeichnet eine strukturierte textile Oberfläche. Für die Auswahl zählen zusätzlich Faserzusammensetzung, Flächengewicht, Konstruktion und Pflegeangaben.',
      'Griff, Dehnung, Blickdichte und Logoausführung am konkreten Artikel prüfen. Die Struktur allein belegt keine Haltbarkeit.',
    ],
    [
      'jersey',
      'Jersey',
      'Maschenware für Shirts und weitere Bekleidung.',
      'Jersey ist eine Familie von Maschenwaren. Faser, Garn, Konstruktion und Ausrüstung beeinflussen den Griff und das Verhalten des konkreten Textils.',
      'Passform und Maßänderung nach vereinbarter Pflege prüfen. Ein Flächengewicht ist keine vollständige Qualitätsbeschreibung.',
    ],
    [
      'sweat',
      'Sweat',
      'Eine Materialgruppe für Sweatshirts und Hoodies.',
      'Sweatstoffe können sich in Rückseite, Zusammensetzung und Gewicht deutlich unterscheiden. Eine angeraute Rückseite beschreibt eine Ausführung, nicht automatisch eine bestimmte Wärmeleistung.',
      'Innenseite, Griff, Pillingverhalten und Maßstabilität anhand von Mustern und geeigneten Prüfungen besprechen.',
    ],
    [
      'mischgewebe',
      'Fasermischungen',
      'Eigenschaften hängen vom ganzen Textil ab.',
      'Baumwolle, Polyester und andere Fasern lassen sich kombinieren. Ein Mischungsverhältnis erklärt jedoch noch nicht die Konstruktion, Ausrüstung oder Pflegeeignung.',
      'Faserangabe, Einsatz, Pflegeetikett und gewünschte Prüfungen zusammen betrachten. Keine allgemeine Eignung für Industriewäsche ableiten.',
    ],
    [
      'stick',
      'Stick',
      'Das Motiv entsteht mit Garn auf dem Textil.',
      'Stickausführung, Unterlage und Stichdichte müssen zum Motiv und zur Stoffkonstruktion passen. Ein Stickprogramm wird für die konkrete Umsetzung vorbereitet.',
      'Kleine Schrift, große dichte Flächen, Stoffverzug und die Rückseite am Muster beurteilen. Position und Größe ausdrücklich freigeben.',
    ],
    [
      'textildruck',
      'Textildruck',
      'Ein Verfahren passend zu Motiv und Material wählen.',
      'Textildruck umfasst unterschiedliche Verfahren. Farbwirkung, Griff und technische Eignung hängen vom Verfahren, dem Material und der Verarbeitung ab.',
      'Ein Muster auf dem tatsächlichen Textil prüfen. Pflegebedingungen und erforderliche Waschversuche projektbezogen vereinbaren.',
    ],
  ].map(([slug, title, description, text, test]) =>
    entry({
      locale: 'de',
      kind: 'material',
      slug: `materialien/${slug}`,
      title,
      description,
      eyebrow: 'Material & Verfahren',
      related: ['muster', 'wissen/stick-oder-druck'],
      sections: [
        section('Einordnen', text),
        section('Am Muster prüfen', test),
        section(
          'Beim Lieferanten nachfragen',
          'Welche konkrete Spezifikation und Pflegeanweisung gelten? Welche Prüfungen liegen für genau diesen Artikel vor? Wo bestehen Grenzen für die vorgesehene Nutzung?',
        ),
      ],
    }),
  ),
  ...[
    [
      'polo',
      'Das Team-Polo',
      'Für einen gemeinsamen Auftritt im Arbeitsalltag.',
      'Piqué oder andere geeignete Konstruktion',
      'Passform, Kragen, Stickfläche',
    ],
    [
      't-shirt',
      'Das Alltags-Shirt',
      'Ein Ausgangspunkt für Teams und Veranstaltungen.',
      'Jersey nach Einsatzzweck',
      'Blickdichte, Größen, Druckfläche',
    ],
    [
      'hoodie',
      'Der Team-Hoodie',
      'Für Teamtage, Wege und informelle Einsätze.',
      'Sweat nach gewünschtem Griff',
      'Kapuze, Kordeln, Motivposition',
    ],
    [
      'sweatshirt',
      'Das Sweatshirt',
      'Ein unkomplizierter Begleiter ohne Kapuze.',
      'Sweat, Rückseite noch abzustimmen',
      'Bündchen, Passform, Veredelung',
    ],
    [
      'longsleeve',
      'Das Langarm-Shirt',
      'Eine zusätzliche Option für Ihr Bekleidungskonzept.',
      'Jersey nach gewünschter Ausführung',
      'Ärmellänge, Material, Pflege',
    ],
    [
      'zip-jacke',
      'Die Sweatjacke',
      'Eine flexible zusätzliche Bekleidungsschicht.',
      'Konstruktion projektbezogen auswählen',
      'Reißverschluss, Taschen, Logoposition',
    ],
  ].map(([slug, title, description, material, focus], i) =>
    entry({
      locale: 'de',
      kind: 'product',
      slug: `teamkleidung/${slug}`,
      eyebrow: `Auswahlprofil / 0${i + 1}`,
      title,
      description,
      ctaLabel: 'Dieses Profil anfragen',
      ctaHref: `/de/anfrage?category=team&product=${slug}`,
      facts: [
        { label: 'Materialidee', value: material },
        { label: 'Wichtige Prüfpunkte', value: focus },
        { label: 'Artikel / Lieferant', value: 'Noch nicht freigegeben' },
        { label: 'Gewicht / Faseranteile', value: 'Am konkreten Artikel zu prüfen' },
        { label: 'Größen / Farben', value: 'Verfügbarkeit nach Anfrage' },
        { label: 'Pflege / Veredelung', value: 'Nach Artikel- und Musterprüfung' },
      ],
      related: ['muster', 'wissen/groessen-erfassen'],
      sections: [
        section(
          'Ein Profil für Ihr Briefing',
          'Dies ist ein Planungsbeispiel und kein freigegebener Katalogartikel. Es wurden weder eine Artikelnummer noch technische Messwerte, Bestände oder Preise erfunden. Beschreiben Sie Ihren Einsatz, damit ein konkretes Modell qualifiziert werden kann.',
        ),
        section(
          'Vor dem Auftrag festhalten',
          'Artikelreferenz, Materialdaten, Größen, Farben, Pflegeanweisung und Veredelung werden auf Basis aktueller Lieferantenunterlagen und des abgestimmten Musters festgehalten.',
        ),
      ],
    }),
  ),
  entry({
    locale: 'de',
    kind: 'resource',
    slug: 'downloads/artworkcheckliste',
    eyebrow: 'Arbeitsblatt / 02',
    title: 'Logo und Artwork vorbereiten.',
    description:
      'Eine offene Checkliste für Ihre nächste Textilanfrage. Drucken oder als PDF über den Druckdialog speichern.',
    sections: [
      section(
        'Datei und Rechte',
        'Halten Sie die beste verfügbare Datei und eine sichtbare Vorschau bereit.',
        [
          'Nutzungsrechte geklärt',
          'Logo-Datei und gewünschte Fassung benannt',
          'Schriften und Bildelemente vollständig',
          'Vorhandene Farbdefinitionen beigefügt',
        ],
      ),
      section('Ausführung', 'Noch offene Punkte dürfen als offen markiert werden.', [
        'Gewünschte Position am Kleidungsstück',
        'Ungefähre Breite und Höhe',
        'Bevorzugtes Verfahren oder „noch offen“',
        'Physisches Muster und Freigabeverantwortung abgestimmt',
      ]),
    ],
  }),
  entry({
    locale: 'de',
    kind: 'resource',
    slug: 'downloads/mustercheckliste',
    eyebrow: 'Arbeitsblatt / 03',
    title: 'Ein Muster nachvollziehbar freigeben.',
    description:
      'Diese Arbeitshilfe strukturiert Prüfpunkte. Sie ersetzt keine projektspezifische Spezifikation oder vertragliche Vereinbarung.',
    sections: [
      section(
        'Referenz festhalten',
        'Projekt: ____________________    Musterfassung: ____________________',
        [
          'Artikel, Material, Farbe und Größe',
          'Dokumentnummer und Datum',
          'Geprüfte Muster und Unterlagen',
        ],
      ),
      section(
        'Prüfen und entscheiden',
        'Vermerken Sie zu jedem Punkt: freigegeben, abweichend oder noch offen.',
        [
          'Maße, Passform und vereinbarte Toleranzen',
          'Farbe, Griff und Verarbeitung',
          'Artwork, Position und Abmessung',
          'Zubehör, Pflegekennzeichnung und Verpackung',
          'Notwendige Prüfberichte und offene Aufgaben',
        ],
      ),
      section(
        'Freigabe dokumentieren',
        'Verantwortliche Person: ____________________    Datum: ____________________\nFreigegebener Umfang / offene Punkte: ________________________________________',
      ),
    ],
  }),
  ...[
    [
      'freigabe-beispiel',
      'Eine Musterfreigabe Schritt für Schritt.',
      'Ein beispielhaftes Team-Polo wird anhand einer Musterreferenz besprochen.',
    ],
    [
      'nachbestellung-beispiel',
      'Eine Nachbestellung beginnt mit der Referenz.',
      'Ein beispielhafter Folgeauftrag übernimmt die Spezifikation, aber keine alten Konditionen.',
    ],
  ].map(([slug, title, description]) =>
    entry({
      locale: 'de',
      kind: 'project',
      slug: `projekte/${slug}`,
      eyebrow: 'Prozessdemonstration · Kein Kundenauftrag',
      title,
      description,
      sections: [
        section(
          'Ausgangslage',
          'Diese Demonstration zeigt einen möglichen Ablauf. Sie enthält keine echten Kunden-, Lieferanten- oder Leistungsdaten.',
        ),
        section(
          'Die Entscheidung dokumentieren',
          'Eine eindeutige Referenz verbindet die Musterfassung mit Artikel, Farbe, Größen und Artwork. Offene Fragen werden mit zuständiger Person festgehalten.',
        ),
        section(
          'Vor Umsetzung erneut prüfen',
          'Menge, Verfügbarkeit, Preis und Termin werden projektbezogen bestätigt. Eine alte Freigabe ersetzt keine aktuelle kaufmännische Vereinbarung.',
        ),
      ],
    }),
  ),
  entry({
    locale: 'en',
    kind: 'offer',
    slug: 'private-label',
    eyebrow: 'For your brand',
    title: 'Your collection. From first idea to garment supply.',
    description:
      'Private-label collections and custom garments for brands and the apparel trade. Development and samples prepare the garment order; repeat supply is agreed for each programme.',
    translation: '/de/private-label',
    ctaLabel: 'Describe your project',
    ctaHref: '/en/contact?category=production&service=supply',
    related: ['garment-supply', 'product-development', 'customers/fashion-brands'],
    sections: [
      section(
        'Separate development from production',
        'A reference sample is not a complete production specification. Measurements, tolerances, materials, trims and packaging need agreement. Any paid development scope must be agreed before work starts.',
      ),
      section(
        'What to include',
        'Unknowns are welcome in an initial brief. Please identify what is decided and what still needs development.',
        [
          'Product category, styles and colours',
          'Quantity per style and size',
          'Tech pack or reference sample, if available',
          'Target market, required tests and desired delivery',
          'Development budget and approval responsibilities',
        ],
      ),
      section(
        'Qualify the supply route',
        'Bangladesh may be a suitable origin for some programmes. Factory capability, responsible specialists and capacity must be verified for each project. No factory ownership or unverified capacity is claimed.',
      ),
    ],
  }),
  entry({
    locale: 'en',
    kind: 'offer',
    slug: 'sourcing-office',
    eyebrow: 'For your procurement team',
    title: 'A defined brief for your sourcing work.',
    description:
      'An ongoing monthly mandate for a defined supplier portfolio, category or production programme. Agree tasks, reporting and responsibilities before work starts.',
    translation: '/de/sourcing-office',
    ctaLabel: 'Discuss your sourcing needs',
    ctaHref: '/en/contact?category=sourcing&service=office',
    related: ['production-management', 'quality-support', 'garment-supply'],
    sections: [
      section(
        'Ongoing support with a monthly budget',
        'A monthly fee covers an agreed supplier portfolio, category or production programme. Define tasks, contacts, reporting frequency, duration and additional work before starting. A one-off programme can instead use a project-based production-management mandate.',
      ),
      section(
        'Who contracts with whom?',
        'Under a service mandate, the buyer contracts with the agreed supplier for the goods. TEXEVO charges a separately agreed fee for its defined services. This is distinct from purchasing finished goods from TEXEVO.',
      ),
      section(
        'Define the scope',
        'Supplier search, sample coordination, progress reporting and quality inspections are different activities. Agree deliverables, reporting dates, access to information and the limits of each check.',
      ),
      section(
        'Make interests transparent',
        'Fees and any commissions must be disclosed and agreed. Project reports do not replace independent testing where the product or target market requires it.',
      ),
    ],
  }),
]
