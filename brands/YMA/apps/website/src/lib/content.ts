/**
 * The page, as data.
 *
 * The original was 542 lines of HTML with the copy welded into the markup, so
 * changing a price meant editing a `<div>`. Separating them is not a Svelte
 * habit — it is what makes the SECOND page (or the English one) cost nothing.
 */

export const NAV = [
	{ href: '#fuer-dich', label: 'Für Dich' },
	{ href: '#ansatz', label: 'Mein Ansatz' },
	{ href: '#motivation', label: 'Meine Motivation' },
	{ href: '#weg', label: 'Dein Weg' }
]

export const VALUES = ['Klarheit', 'Ruhe', 'Rhythmus', 'Vertrauen']

/** The three things people arrive with. Each card carries one of the tones. */
export const THEMES = [
	{
		kicker: 'Leben · Einklang',
		tone: 'teal',
		title: 'Wenn Dein Leben nicht mehr stimmig ist',
		body: 'In Deinem Alltag, Deinen Beziehungen oder in Dir selbst ist eine Unruhe, die Du nicht genau greifen kannst. Du spürst nur, irgendetwas passt nicht mehr. Du funktionierst nur noch, bist innerlich unruhig und hetzt von einer Aufgabe oder einem Termin zum nächsten. Wer Du bist und was Du wirklich willst, weißt Du kaum noch.',
		together:
			'Gemeinsam schauen wir unter die Oberfläche, erkennen den Kern und bringen Schritt für Schritt wieder mehr Klarheit, Ruhe und Harmonie in Dein Leben.',
		image: 'lake.jpg'
	},
	{
		kicker: 'Kopf · Ruhe',
		tone: 'blue',
		title: 'Wenn Dein Kopf nicht zur Ruhe kommt',
		body: 'Da sind einfach zu viele Gedanken und zu viele offene Themen. Du bist überfordert, Dir fehlt die Orientierung und Du weißt nicht, wo Du anfangen sollst.',
		together:
			'Gemeinsam bringen wir Ordnung und Struktur in das, was gerade zu viel Raum einnimmt. Damit Du wieder klar sehen, bewusst entscheiden und freier handeln kannst.',
		image: 'stones.jpg'
	},
	{
		kicker: 'Business · Fluss',
		tone: 'pink',
		title: 'Wenn Dein Business nicht fließen will',
		body: 'Du hast Dir was aufgebaut, viel Zeit, Energie und Herzblut investiert und trotzdem kommt Dein Business nicht wirklich ins Fließen. Irgendwas blockiert.',
		together:
			'Gemeinsam machen wir sichtbar, was Dich innerlich zurückhält und lösen Unstimmigkeiten auf. Mit neuer Klarheit, Leichtigkeit und Vertrauen zeigt sich dieser natürliche Fluss Schritt für Schritt auch im Außen.',
		image: 'flowing.jpg'
	}
]

/** How the work goes — three steps, each with its own colour bar. */
export const JOURNEY = [
	{
		title: 'Ich glaube an Dich',
		emphasis: 'von Anfang an',
		body: 'und auch dann, wenn Du es selbst gerade nicht kannst.',
		bar: 'linear-gradient(90deg, var(--color-blue), #6fb0d6)'
	},
	{
		title: 'Ich halte den Raum',
		emphasis: 'in dem Du einfach sein darfst',
		body: 'Dich gesehen fühlst und bei Dir ankommen kannst.',
		bar: 'linear-gradient(90deg, var(--color-calm), #83cdbe)'
	},
	{
		title: 'Ich erkenne den Kern',
		emphasis: 'das, was Dich wirklich bewegt',
		body: 'Und ich begleite Dich mit Klarheit & Präsenz in stimmige nächste Schritte.',
		bar: 'linear-gradient(90deg, var(--color-pink), #e98cae)'
	}
]

/** The two ways to work together. */
export const OFFERS = [
	{
		title: 'Kompass-Gespräch',
		subtitle: 'Dein Raum für Klarheit',
		meta: '90 Min.',
		price: '224 €*',
		tone: 'teal' as const,
		body: 'Manchmal braucht es keinen langen Prozess, sondern einen geschützten Raum, Klarheit und einen Blick von außen. In unserer gemeinsamen Session schauen wir unter die Oberfläche, erkennen den Kern dessen, was Dich wirklich bewegt, und bringen Ordnung in das, was gerade unklar, blockiert oder unstimmig erscheint. Du gehst mit mehr Klarheit, Orientierung und konkreten nächsten Schritten aus dem Gespräch.',
		items: [] as string[],
		featured: false
	},
	{
		title: 'Zurück zu Dir',
		subtitle: 'von beschäftigt zu erfüllt',
		meta: '3 Monate',
		price: '369 € / Monat*',
		note: 'Einmalzahlung: 1.107 €*',
		tone: 'pink' as const,
		body: 'Für Dich, wenn Du nicht nur erkennen, sondern nachhaltig verändern möchtest. Über drei Monate begleite ich Dich dabei, innere Unstimmigkeiten sichtbar zu machen, Gedankenchaos zu ordnen, Blockaden zu lösen und Schritt für Schritt wieder in Deinen eigenen Rhythmus zu finden. Gemeinsam schaffen wir mehr Ruhe, Harmonie und Selbstbestimmung, damit Du wieder bei Dir ankommen kannst. Du gehst danach wieder mit neuer Klarheit, mehr Energie und Leichtigkeit Deinen eigenen Weg.',
		items: [
			'Ein persönliches Treffen pro Monat (ca. 60–90 Minuten)',
			'Ein 1:1 Telefonat pro Monat (ca. 60 Minuten)',
			'Messenger-Begleitung zwischen den Terminen für kurze Fragen und Impulse per WhatsApp, Telegram oder Signal',
			'Raum für Reflexion, Klarheit und Entwicklung'
		],
		featured: true
	}
]

export const LEGAL = [
	{ href: '/impressum', label: 'Impressum' },
	{ href: '/datenschutz', label: 'Datenschutz' },
	{ href: '/agb', label: 'AGB' },
	{ href: '/widerrufsrecht', label: 'Widerrufsrecht' }
]

/** Charged under §19 UStG, which has to appear wherever a price does. */
export const VAT_NOTE = '* Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.'
