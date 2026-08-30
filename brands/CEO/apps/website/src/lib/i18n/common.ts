import type { Lang } from './index'

/** Header, footer, the avenCEO-name call to action and the waiting list — shared by every page. */
export const common: Record<
	Lang,
	{
		nav: {
			skills: string
			avens: string
			pricing: string
			docs: string
			cta: string
			menu: string
			closeMenu: string
			/** Names the navigation for a screen reader — the bar and the menu are two
			 * renderings of one set of destinations, so they share the label. */
			primaryLabel: string
			/** The menu's eyebrow. */
			whereTo: string
			/** The line that lets the menu end on purpose rather than stop. */
			trust: string
			/** What each destination IS. Four words tell you their names; these tell
			 * you which one you want, which is the question someone opening a menu is
			 * actually asking. */
			skillsMeta: string
			avensMeta: string
			pricingMeta: string
			docsMeta: string
		}
		switchLabel: string
		footer: {
			tagline: string
			pagesLabel: string
			legalLabel: string
			socialLabel: string
			ctaLabel: string
			copyright: string
			legal: {
				impressum: string
				datenschutz: string
				socialMedia: string
				agb: string
				widerruf: string
			}
		}
		idCta: {
			eyebrow: string
			title: string
			/** HTML — our own static copy, carries <strong> emphasis. */
			bodyHtml: string
			/** The early-adopter perk this €25 unlocks — the real hook, as a bullet. */
			betaLine: (pct: number, months: number) => string
			betaPriceLine: (discounted: string, regular: string) => string
			placeholder: string
			button: string
			exampleLabel: string
			priceNote: (price: string) => string
			formLabel: string
		}
		board: {
			eyebrow: (next: number) => string
			more: (n: number) => string
			yourName: string
			free: string
			footnote: string
		}
	}
> = {
	de: {
		nav: {
			skills: 'Skills',
			avens: 'Marketplace',
			pricing: 'Preise',
			docs: 'Docs',
			cta: 'Aven anstellen',
			menu: 'Menü',
			closeMenu: 'Menü schließen',
			primaryLabel: 'Hauptnavigation',
			whereTo: 'Wohin',
			trust: 'Sicher verbunden über aven.id',
			skillsMeta: 'Die Arbeit, die dein Aven schon beherrscht.',
			avensMeta: 'Skills von anderen, bereit zum Einstellen.',
			pricingMeta: 'Was es kostet und was du dafür bekommst.',
			docsMeta: 'Die Tokens und Bausteine, aus denen das hier besteht.'
		},
		switchLabel: 'Sprache',
		footer: {
			tagline: 'Deine eigene KI, deine eigene Firma — und das, was du damit baust, gehört dir.',
			pagesLabel: 'Seiten',
			legalLabel: 'Rechtliches',
			socialLabel: 'Social Media',
			ctaLabel: 'Namen sichern',
			copyright: 'avenCEO — Own your life',
			legal: {
				impressum: 'Impressum',
				datenschutz: 'Datenschutz',
				socialMedia: 'Social-Media-Datenschutz',
				agb: 'AGB',
				widerruf: 'Widerrufsrecht'
			}
		},
		idCta: {
			eyebrow: 'Invite only',
			title: 'Sichere dir jetzt deinen avenCEO‑Namen',
			bodyHtml:
				'Dein eigener avenNAME — z. B. <strong class="font-medium text-foreground/82">avenMAIA</strong> — samt eigener Domain <strong class="font-medium text-foreground/82">maia.aven.ceo</strong>. Er ist Name und Adresse deines Avens in einem: wie eine Telefonnummer ist er der Weg, auf dem jemand deinen Aven erreicht, der mit ihm sprechen will. Es gibt ihn genau einmal — sichere ihn dir, bevor es jemand anderes tut.',
			betaLine: (pct, months) =>
				`inkl. ${pct}% Rabatt auf deine ersten ${months} Monate avenCEO`,
			betaPriceLine: (discounted, regular) => `${discounted} €/m statt ${regular} €`,
			placeholder: 'maia',
			button: 'Namen sichern →',
			exampleLabel: 'Beispiel:',
			priceNote: (price) => `einmalig ${price} € inkl. USt.`,
			formLabel: 'Namen sichern'
		},
		board: {
			eyebrow: (next) => `Warteliste · Platz ${next} ist frei`,
			more: (n) => `und ${n} weitere`,
			yourName: 'dein Name',
			free: 'frei',
			footnote: 'Wer zuerst steht, gründet zuerst — und jeden Namen gibt es genau einmal.'
		}
	},
	en: {
		nav: {
			skills: 'Skills',
			avens: 'Marketplace',
			pricing: 'Pricing',
			docs: 'Docs',
			cta: 'Hire your Aven',
			menu: 'Menu',
			closeMenu: 'Close menu',
			primaryLabel: 'Main navigation',
			whereTo: 'Where to',
			trust: 'Securely connected through aven.id',
			skillsMeta: 'The work your aven already knows how to do.',
			avensMeta: 'Skills other people built, ready to hire.',
			pricingMeta: 'What it costs, and what you get for it.',
			docsMeta: 'The tokens and parts this is all built from.'
		},
		switchLabel: 'Language',
		footer: {
			tagline: 'Your own AI, your own company — and what you build with it belongs to you.',
			pagesLabel: 'Pages',
			legalLabel: 'Legal',
			socialLabel: 'Social media',
			ctaLabel: 'Claim your name',
			copyright: 'avenCEO — Own your life',
			legal: {
				impressum: 'Imprint',
				datenschutz: 'Privacy',
				socialMedia: 'Social media privacy',
				agb: 'Terms',
				widerruf: 'Right of withdrawal'
			}
		},
		idCta: {
			eyebrow: 'Invite only',
			title: 'Claim your avenCEO name now',
			bodyHtml:
				'Your own avenNAME — e.g. <strong class="font-medium text-foreground/82">avenMAIA</strong> — with your own domain <strong class="font-medium text-foreground/82">maia.aven.ceo</strong>. It is your Aven’s name and address in one: like a phone number, it is how anyone reaches yours when they want to talk to it. It exists exactly once — claim it before someone else does.',
			betaLine: (pct, months) =>
				`incl. ${pct}% off your first ${months} months of avenCEO`,
			betaPriceLine: (discounted, regular) => `${discounted} €/m instead of ${regular} €`,
			placeholder: 'maia',
			button: 'Claim your name →',
			exampleLabel: 'Example:',
			priceNote: (price) => `one-time ${price} € incl. VAT`,
			formLabel: 'Claim your name'
		},
		board: {
			eyebrow: (next) => `Waiting list · place ${next} is open`,
			more: (n) => `and ${n} more`,
			yourName: 'your name',
			free: 'open',
			footnote: 'Whoever stands first, founds first — and every name exists exactly once.'
		}
	}
}
