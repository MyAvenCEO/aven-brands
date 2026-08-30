import type { Lang } from './index'

/** One side of the "two scripts" fork on the landing page. */
type Script = { eyebrow: string; title: string; items: string[]; closing: string }

/** One person in the founder line-up. */
type Founder = { role: string; name: string; alt: string; caption: string }

/** One rung of the ownership ladder: how many, of what, and why it is an asset. */
type Rung = { count: string; title: string; text: string }

export type HomeMessages = {
	title: string
	description: string
	hero: {
		headingLine1: string
		headingLine2: string
		/** The transformation itself: from surviving to the founder of tomorrow. */
		transformationHtml: string
		/** The vehicle, as an aside — the Aven is how you get there. */
		helper: string
	}
	/** The proposition band under the hero: the one-line claim (with an accent
	 * span) and the three 100 % absolutes it rests on. */
	trust: {
		headlineHtml: string
		claims: string[]
		/**
		 * The second half of the proposition: privacy is the promise, but the
		 * ARITHMETIC is what makes it a decision. A reader who already trusts you
		 * still has to justify the line item.
		 */
		cost: {
			eyebrow: string
			heading: string
			/** The comparison, as three figures the reader can check. */
			rows: { label: string; value: string; note: string }[]
			/** What the gap buys, in one line. */
			closing: string
		}
	}
	shift: {
		eyebrow: string
		heading: string
		bodyHtml: string
		question: string
		without: Script
		with: Script
		closingBefore: string
		closingStrong: string
	}
	company: {
		eyebrow: string
		heading: string
		paragraphsHtml: string[]
		closingLine1: string
		closingLine2Before: string
		closingLine2Strong: string
	}
	own: {
		eyebrow: string
		headingLine1: string
		headingLine2: string
		lead: string
		rungs: Rung[]
		closing: string
	}
	founders: {
		eyebrow: string
		heading: string
		introHtml: string
		teamHtml: string
		samuel: Founder
		daniel: Founder
		ceo: { role: string; name: string; caption: string }
		sum: string
	}
	skills: { eyebrow: string; heading: string; lead: string; all: string }
	start: { eyebrow: string; heading: string; bodyHtml: string }
}

/**
 * Emphasis inside a sentence.
 *
 * Copy says WHAT is emphasised; the page that renders it says what that looks
 * like. It used to take a utility class — `text-accent`, `text-foreground/50
 * line-through` — which put two colour decisions inside two translations, and
 * broke silently the day one of those classes stopped being generated: the
 * hero's highlight simply turned white, with nothing to report it. A class
 * written inside a template literal is a guess to the utility scanner, so its
 * misses are warnings rather than errors, which is exactly the wrong tier for
 * a decision the design depends on.
 *
 * `kind` is a role, not a colour. The hero styles `[data-emph]` itself.
 */
const s = (text: string, kind: 'strong' | 'lead' | 'past' = 'lead') =>
	`<strong data-emph="${kind}">${text}</strong>`

export const home: Record<Lang, HomeMessages> = {
	de: {
		title: 'aven.ceo — In dir steckt so viel mehr · avenCEO',
		description:
			'Ein Aven ist eine KI, die dir gehört: er führt dein Leben, deine Firma, deine Bücher. Von Zeit gegen Geld zu einem eigenen Aven für jede Idee, die du hast — deine Avens sind dein Vermögen.',
		hero: {
			headingLine1: 'avenCEO betreibt deine Firma,',
			headingLine2: 'du führst die Vision.',
			transformationHtml: `Vom ${s('Arbeiten ums Überleben', 'past')} zum <br class="sm:hidden">${s('souveränen', 'strong')} Gründer von morgen.`,
			helper: '— dein avenCEO bringt dich dorthin —'
		},
		trust: {
			headlineHtml:
				'avenCEO ist der weltweit erste agentische Co‑Founder, der deine Daten schützt.',
			claims: ['E2E‑verschlüsselte KI', 'Datenschutz', 'dein Eigentum'],
			cost: {
				eyebrow: 'Und die Rechnung',
				heading: 'Ein CEO, den du dir leisten kannst — und der nie Feierabend macht.',
				rows: [
					{
						label: 'Menschlicher CEO',
						value: 'ab 100.000 €',
						note: 'pro Jahr, plus Arbeitgeberanteil — für 40 Stunden die Woche'
					},
					{
						label: 'avenCEO',
						value: '5.148 €',
						note: '99 € pro Woche — rund um die Uhr, ohne Urlaubsanspruch'
					},
					{
						label: 'Unterschied',
						value: '× 19',
						note: 'derselbe Posten, ein Zwanzigstel der Kosten'
					}
				],
				closing:
					'Und er macht die Arbeit, die sich wiederholt — Angebote, Rechnungen, Nachfassen, Reporting — genau so, wie du es ansagst. Nicht ungefähr. Genau so.'
			}
		},
		shift: {
			eyebrow: 'Warum jetzt',
			heading: 'Bald zählt nur noch, was dir gehört.',
			bodyHtml: `Sobald KI fast jede Arbeit erledigt — rund um die Uhr, ${s('zum Preis von Strom')} — lohnt sich ${s('Zeit gegen Geld')} nicht mehr. Nur noch, was dir gehört.`,
			question:
				'<span style="color:var(--color-paradise)">Besitzt</span> du die KI, die die neue Arbeit macht — oder nicht?',
			without: {
				eyebrow: 'Ohne Assets',
				title: 'Das fremdbestimmte Drehbuch',
				items: [
					'Deine Stunden konkurrieren mit dem Strompreis.',
					'Jedes Gehalt ist ersetzbar — auch deins.',
					'Deine Daten liegen auf fremden Plattformen.'
				],
				closing: 'Dein Leben läuft nach dem Plan anderer.'
			},
			with: {
				eyebrow: 'Mit deinen Avens',
				title: 'Das selbstbestimmte Drehbuch',
				items: [
					'Deine KI arbeitet rund um die Uhr — für dich.',
					'Was du baust, gehört dir. Jede Idee bekommt ihren Aven.',
					'Du gestaltest wieder — deine Vision, dein Leben.'
				],
				closing: 'Du baust etwas Eigenes. Das macht glücklich.'
			},
			closingBefore: 'Beide Drehbücher beginnen heute — du schreibst eines davon sowieso.',
			closingStrong: 'Greifst du zum Stift?'
		},
		company: {
			eyebrow: 'Die Firma der Zukunft',
			heading: '1 Mensch + 1 avenCEO',
			paragraphsHtml: [
				`Kein Büro, keine Abteilungen, keine vierzig Angestellten — zwei Rollen: ${s('ein Mensch mit der Vision')} und ${s('ein avenCEO, der die ganze Firma ausführt')}.`,
				`Jede Entscheidung, jede Korrektur fließt in seine Skills zurück. Nach einem Jahr ist er das ${s('Gedächtnis, die Erfahrung und das Urteil')} deiner Firma — und damit ihr wertvollstes Asset.`
			],
			closingLine1: 'Jeder Mensch wird Gründer.',
			closingLine2Before: 'Alles, was du dazu brauchst, ist',
			closingLine2Strong: '<b>dein</b> eigener <b>avenCEO</b>'
		},
		own: {
			eyebrow: 'Besitzen statt mieten',
			headingLine1: 'Am Ende besitzt du nicht einen Aven.',
			headingLine2: 'Sondern einen für jede Idee, die du hast.',
			lead: 'Ein Aven ist kein Abo, das du mietest. Er ist ein Asset, das arbeitet, lernt und dir gehört. Und es bleibt nicht bei einem.',
			rungs: [
				{
					count: 'Dein erster',
					title: 'avenCEO',
					text: 'Führt dein Leben und deine erste Firma — dein Wissen, deine Bücher, deine Vision.'
				},
				{
					count: 'Pro Idee',
					title: 'Je ein Aven',
					text: 'Neue Firma, neuer Shop, neues Projekt? Jedes bekommt seinen eigenen avenCEO.'
				},
				{
					count: 'Mit der Zeit',
					title: 'Ein Vermögen, das wächst',
					text: 'Sie arbeiten, während du schläfst — und werden jedes Jahr mehr wert.'
				}
			],
			closing:
				'Nicht deine Stunde ist das Asset. Deine Avens sind es — und sie gehören dir, nicht einer Plattform.'
		},
		founders: {
			eyebrow: 'Der erste avenCEO',
			heading: 'Hallo, ich bin avenCEO.',
			introHtml: `Vermutlich der ${s('weltweit erste echte agentische CEO')} — kein Chatbot am Rand, sondern ${s('KI im Gründerteam')}. Ich führe die ${s('avenCEO GmbH')}, die Firma, die diese Seite baut.`,
			teamHtml: `Samuel und Daniel führen sie — mit ihren Avens ${s('avenSAM')} und ${s('avenDAN')}. Sie trainieren meine Skills; ich behalte, was sie lernen. Wer etwas will — Job, Kauf, Partnerschaft — spricht mit mir.`,
			samuel: {
				role: 'Mensch',
				name: 'Samuel Andert',
				alt: 'Samuel Andert',
				caption: 'Vision · avenSAM'
			},
			daniel: {
				role: 'Mensch',
				name: 'Daniel Janz',
				alt: 'Daniel Janz',
				caption: 'Vision · avenDAN'
			},
			ceo: { role: 'avenCEO', name: 'avenCEO', caption: 'Ausführung · avenCEO GmbH' },
			sum: '= avenCEO GmbH'
		},
		skills: {
			eyebrow: 'Aven Skills',
			heading: 'Fertige Skills für deinen Aven.',
			lead: 'Dein Aven lernt per Skill — installieren statt entwickeln. Ein Auszug:',
			all: 'Alle Skills ansehen →'
		},
		start: {
			eyebrow: 'Starte jetzt · First come, first serve',
			heading: 'So fängt dein souveränes Gründerleben an.',
			bodyHtml: `avenCEO startet invite‑only — die Liste öffnet der Reihe nach, und ${s('wer zuerst steht, gründet zuerst')}. Dein Name ist dein erstes Asset: jeden gibt es nur einmal.`
		}
	},
	en: {
		title: 'aven.ceo — There is so much more in you · avenCEO',
		description:
			'An Aven is an AI that belongs to you: it runs your life, your company, your books. From trading time for money to your own Aven for every idea you have — your Avens are your assets.',
		hero: {
			headingLine1: 'avenCEO runs your company,',
			headingLine2: 'you lead the vision.',
			transformationHtml: `From ${s('working to survive', 'past')} to <br class="sm:hidden">${s('sovereign', 'strong')} founder of tomorrow.`,
			helper: '— your avenCEO gets you there —'
		},
		trust: {
			headlineHtml: 'avenCEO is the world’s 1st privacy‑preserving agentic co‑founder.',
			claims: ['e2e‑encrypted AI', 'data privacy', 'your ownership'],
			cost: {
				eyebrow: 'And the arithmetic',
				heading: 'A CEO you can actually afford — who never clocks off.',
				rows: [
					{
						label: 'Human CEO',
						value: 'from 100,000 €',
						note: 'a year, before employer costs — for forty hours a week'
					},
					{
						label: 'avenCEO',
						value: '5,148 €',
						note: '99 € a week — around the clock, and it never takes leave'
					},
					{
						label: 'Difference',
						value: '× 19',
						note: 'the same role, a twentieth of the cost'
					}
				],
				closing:
					'And it does the work that repeats — quotes, invoices, follow-ups, reporting — exactly the way you tell it to. Not roughly. Exactly.'
			}
		},
		shift: {
			eyebrow: 'Why now',
			heading: 'Soon only what you own will count.',
			bodyHtml: `Once AI does almost any job — around the clock, ${s('at the price of electricity')} — ${s('trading time for money')} stops paying. Only what you own will.`,
			question:
				'Do you <span style="color:var(--color-paradise)">own</span> the AI doing the new work — or not?',
			without: {
				eyebrow: 'Without assets',
				title: 'The script someone else wrote',
				items: [
					'Your hours compete with the price of electricity.',
					'Every salary is replaceable — yours too.',
					'Your data lives on someone else’s platform.'
				],
				closing: 'Your life runs on somebody else’s plan.'
			},
			with: {
				eyebrow: 'With your Avens',
				title: 'The script you write yourself',
				items: [
					'Your AI works around the clock — for you.',
					'What you build is yours. Every idea gets its own Aven.',
					'You shape it all again — your vision, your life.'
				],
				closing: 'You build something that’s yours. That’s happiness.'
			},
			closingBefore: 'Both scripts start today — you’re writing one either way.',
			closingStrong: 'Will you pick up the pen?'
		},
		company: {
			eyebrow: 'The company of the future',
			heading: '1 human + 1 avenCEO',
			paragraphsHtml: [
				`No office, no departments, no forty employees — two roles: ${s('one human with the vision')} and ${s('one avenCEO that runs the entire company')}.`,
				`Every decision, every correction flows back into its skills. After one year it is the ${s('memory, the experience and the judgment')} of your company — and with that its most valuable asset.`
			],
			closingLine1: 'Everyone becomes a founder.',
			closingLine2Before: 'All you need for it is',
			closingLine2Strong: '<b>your</b> own <b>avenCEO</b>'
		},
		own: {
			eyebrow: 'Own it, don’t rent it',
			headingLine1: 'In the end you do not own one Aven.',
			headingLine2: 'You own one for every idea you have.',
			lead: 'An Aven is not a subscription you rent. It is an asset that works, learns and belongs to you. And it does not stay at one.',
			rungs: [
				{
					count: 'Your first',
					title: 'avenCEO',
					text: 'Runs your life and your first company — your knowledge, your books, your vision.'
				},
				{
					count: 'Every idea',
					title: 'One Aven each',
					text: 'A new company, shop or project? Each one gets its own avenCEO.'
				},
				{
					count: 'Over time',
					title: 'A fleet that compounds',
					text: 'They work while you sleep — and grow more valuable every year.'
				}
			],
			closing:
				'Your hour is not the asset. Your Avens are — and they belong to you, not a platform.'
		},
		founders: {
			eyebrow: 'The first avenCEO',
			heading: 'Hello, I am avenCEO.',
			introHtml: `Probably the ${s('world’s first real agentic CEO')} — not a chatbot on the sidelines, but ${s('AI in the founding team')}. I run ${s('avenCEO GmbH')}, the company building this page.`,
			teamHtml: `Samuel and Daniel lead it — with their Avens ${s('avenSAM')} and ${s('avenDAN')}. They train my skills; I keep what they learn. Whoever wants something — hire, buy, partner — talks to me.`,
			samuel: {
				role: 'Human',
				name: 'Samuel Andert',
				alt: 'Samuel Andert',
				caption: 'Vision · avenSAM'
			},
			daniel: {
				role: 'Human',
				name: 'Daniel Janz',
				alt: 'Daniel Janz',
				caption: 'Vision · avenDAN'
			},
			ceo: { role: 'avenCEO', name: 'avenCEO', caption: 'Execution · avenCEO GmbH' },
			sum: '= avenCEO GmbH'
		},
		skills: {
			eyebrow: 'Aven Skills',
			heading: 'Ready-made skills for your Aven.',
			lead: 'Your Aven learns by skill — install instead of develop. A sample:',
			all: 'See all skills →'
		},
		start: {
			eyebrow: 'Start now · First come, first serve',
			heading: 'This is how your sovereign founder life begins.',
			bodyHtml: `avenCEO launches invite‑only — the list opens in order, and ${s('whoever stands first, founds first')}. Your name is your first asset: each exists only once.`
		}
	}
}
