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
		/* The sentence AFTER the lockup. `avenCEO` is not text here — it is the
		   logo leaf, so the brand renders in its own two faces rather than being
		   re-typed in the body font on the one line that names it. Both locales
		   open on the lockup, so the split is the same in both. */
		headlineRest: string
		claims: string[]
		/**
		 * The second half of the proposition: privacy is the promise, but the
		 * ARITHMETIC is what makes it a decision. A reader who already trusts you
		 * still has to justify the line item.
		 */
		/**
		 * The arithmetic, as its own section rather than a coda to the privacy
		 * band: two claims sharing one ground read as one claim with a footnote.
		 */
		cost: {
			eyebrow: string
			/** The invitation. Never the price — the figure below is the payoff and
			 * a heading that already said it spends it twice. */
			heading: string
			lead: string
			/** What it actually runs, so "a CEO" is concrete rather than a claim. */
			does: string[]
			/** The two sides, in the units each is actually sold in. */
			human: { label: string; value: string; unit: string; note: string }
			aven: { label: string; value: string; unit: string; note: string }
			/** The turn: what the gap is FOR. */
			closing: string
			kicker: string
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
			headingLine1: ' betreibt deine Firma,',
			headingLine2: 'du führst die Vision.',
			transformationHtml: `Vom ${s('Arbeiten ums Überleben', 'past')} zum <br class="sm:hidden">${s('souveränen', 'strong')} Gründer von morgen.`,
			helper: '— dein avenCEO bringt dich dorthin —'
		},
		trust: {
			headlineRest:
				' ist der weltweit erste agentische Co‑Founder, der deine Daten schützt.',
			claims: ['E2E‑verschlüsselte KI', 'Datenschutz', 'dein Eigentum'],
			cost: {
				eyebrow: 'Dein Moment',
				heading: 'Es war nie leichter, das Unternehmen zu starten, von dem du immer geträumt hast.',
				lead: 'Du sagst, was du willst. Dein Aven führt es aus — rund um die Uhr, ab Tag eins.',
				does: [
					'Baut deine Website',
					'Führt deinen Betrieb',
					'Schreibt Angebote und Rechnungen',
					'Fasst nach, jeden Tag'
				],
				human: {
					label: 'Menschlicher CEO',
					value: '> 100.000 €',
					unit: 'pro Jahr',
					note: 'plus Arbeitgeberanteil, Bonus und Ausstattung — für 40 Stunden die Woche, abzüglich Urlaub und Krankheit'
				},
				aven: {
					label: 'avenCEO',
					value: 'ab 99 €',
					unit: 'pro Woche',
					note: 'rund um die Uhr, sieben Tage, ohne Urlaubsanspruch'
				},
				closing: 'Nicht günstiger. Eine andere Größenordnung.',
				kicker: 'Das ist dein Moment.'
			}
		},
		shift: {
			eyebrow: 'Warum jetzt',
			heading: 'Bald zählt nur noch, was dir gehört.',
			bodyHtml: `Wenn KI fast jede Arbeit erledigt — ${s('zum Preis von Strom')} — lohnt sich ${s('Zeit gegen Geld')} nicht mehr.`,
			question: 'Besitzt du die KI, die die neue Arbeit macht?',
			without: {
				eyebrow: 'Ohne avenCEO',
				title: 'Fremdbestimmt',
				items: [
					'Deine Stunden konkurrieren mit dem Strompreis.',
					'Jedes Gehalt ist ersetzbar — auch deins.',
					'Deine Daten liegen auf fremden Plattformen.'
				],
				closing: 'Der Plan anderer.'
			},
			with: {
				eyebrow: 'Mit avenCEO',
				title: 'Selbstbestimmt',
				items: [
					'Deine KI arbeitet rund um die Uhr — für dich.',
					'Was du baust, gehört dir — für immer.',
					'Du gestaltest wieder — deine Vision, dein Leben.'
				],
				closing: 'Dein Plan.'
			},
			closingBefore: 'Beide beginnen heute. Du schreibst eines davon sowieso.',
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
			headingLine1: ' runs your company,',
			headingLine2: 'you lead the vision.',
			transformationHtml: `From ${s('working to survive', 'past')} to <br class="sm:hidden">${s('sovereign', 'strong')} founder of tomorrow.`,
			helper: '— your avenCEO gets you there —'
		},
		trust: {
			headlineRest: ' is the world’s 1st privacy‑preserving agentic co‑founder.',
			claims: ['e2e‑encrypted AI', 'data privacy', 'your ownership'],
			cost: {
				eyebrow: 'Your moment',
				heading: 'It has never been easier to start the company you always dreamed of.',
				lead: 'You teach it what you want. Your Aven executes — around the clock, from day one.',
				does: [
					'Builds your website',
					'Runs your operations',
					'Writes quotes and invoices',
					'Follows up, every day'
				],
				human: {
					label: 'Human CEO',
					value: '> 100,000 €',
					unit: 'per year',
					note: 'before employer costs, bonus and equipment — for forty hours a week, minus holiday and sick leave'
				},
				aven: {
					label: 'avenCEO',
					value: 'from 99 €',
					unit: 'per week',
					note: 'around the clock, seven days, no leave to accrue'
				},
				closing: 'Not cheaper. A different order of magnitude.',
				kicker: 'This is your moment.'
			}
		},
		shift: {
			eyebrow: 'Why now',
			heading: 'Soon only what you own will count.',
			bodyHtml: `When AI does almost any job — ${s('at the price of electricity')} — ${s('trading time for money')} stops paying.`,
			question: 'Do you own the AI doing the new work?',
			without: {
				eyebrow: 'Without avenCEO',
				title: 'Someone else’s script',
				items: [
					'Your hours compete with the price of electricity.',
					'Every salary is replaceable — yours too.',
					'Your data lives on someone else’s platform.'
				],
				closing: 'Their plan.'
			},
			with: {
				eyebrow: 'With avenCEO',
				title: 'The script you write',
				items: [
					'Your AI works around the clock — for you.',
					'You own what you build — forever.',
					'You shape it again — your vision, your life.'
				],
				closing: 'Your plan.'
			},
			closingBefore: 'Both start today. You are writing one either way.',
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
