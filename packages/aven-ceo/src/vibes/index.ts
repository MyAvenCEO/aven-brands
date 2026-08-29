/**
 * `@myavenceo/aven-ceo/vibes` — the brand's own vibes.
 *
 * A vibe is a complete little app rendered from data: a `ViewDef`, a
 * `StyleDef`, and (where it has behaviour) a sandboxed program string. The
 * ENGINE that renders one is `@myavenceo/aven-vibes`, which holds no brand
 * knowledge at all; what a vibe of THIS brand looks like — its tokens, its
 * shell, its card, its badge — is a brand fact, and so it lives here.
 *
 * It used to live in the consuming app: `brandTokens` sat in that app's UI
 * library while already importing `vibeTokens` from this package, and the
 * chat and todo vibes sat beside the actors that mounted them. That put brand
 * data one repository away from the palette it is derived from, which is the
 * arrangement every drift in this package's history started as. Moving them
 * here leaves the consumer with the wiring (actors, windows, the `.pl` state
 * machine it parses) and the brand with the appearance.
 *
 * Three exports, three shapes:
 *
 *   brand-style   `brandTokens`, `brandBaseSelectors`, `withBrand` — the
 *                 foundation every vibe composes on top of
 *   chat          `chatView`, `chatStyle` — the transcript, as a window
 *   todo          `todoListView`, `todoBoardView`, `todoStyle`, plus
 *                 `todoLogic` / `composeTodoProgram` — the behaviour as data
 *
 * Engine types come from `@myavenceo/aven-vibes` directly. Nothing here
 * imports from a consuming application.
 */
export { brandBaseSelectors, brandTokens, withBrand } from './brand-style.js'
export { chatStyle, chatView } from './chat/view.js'
export { composeTodoProgram, type TodoMachine, todoLogic } from './todo/logic.js'
export { todoStyle } from './todo/style.js'
export { todoBoardView, todoListView } from './todo/view.js'
