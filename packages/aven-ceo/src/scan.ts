/**
 * The class scanner. Brand-agnostic, so it lives in the kit; re-exported here
 * because consumers already import it from this package.
 */
export {
	type ClassUse,
	scanCandidates,
	scanDeclaredClasses,
	scanFiles,
	scanSource
} from '@myavenceo/aven-brandkit'
