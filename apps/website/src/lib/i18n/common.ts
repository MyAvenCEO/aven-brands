import type { Lang } from './index'

/** Header, footer, the avenCEO-name call to action and the waiting list — shared by every page. */
export const common: Record<
	Lang,
	{
		nav: { skills: string; avens: string; pricing: string; cta: string }
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
			betaScarcity: string
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
		nav: { skills: 'Skills', avens: 'Avens', pricing: 'Preise', cta: 'Namen sichern' },
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
			eyebrow: 'Warteliste · Invite only',
			title: 'Sichere dir deinen avenCEO‑Namen',
			bodyHtml:
				'Wie eine Domain — aber für deinen avenCEO: z. B. <strong class="font-medium text-foreground/82">maia.aven.ceo</strong>. Diesen Namen gibt es genau einmal — sichere ihn dir, bevor es jemand anderes tut.',
			betaLine: (pct, months) => `+ ${pct} % Rabatt auf die ersten ${months} Monate avenCEO`,
			betaPriceLine: (discounted, regular) => `${discounted} €/m statt ${regular} €`,
			betaScarcity: '1 / 10 vergeben',
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
		nav: { skills: 'Skills', avens: 'Avens', pricing: 'Pricing', cta: 'Claim your name' },
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
			eyebrow: 'Waiting list · Invite only',
			title: 'Claim your avenCEO name',
			bodyHtml:
				'Like a domain — but for your avenCEO: e.g. <strong class="font-medium text-foreground/82">maia.aven.ceo</strong>. It exists exactly once — claim it before someone else does.',
			betaLine: (pct, months) => `+ ${pct} % off your first ${months} months of avenCEO`,
			betaPriceLine: (discounted, regular) => `${discounted} €/m instead of ${regular} €`,
			betaScarcity: '1 / 10 claimed',
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
