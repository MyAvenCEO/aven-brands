/**
 * The class scanner. Brand-agnostic, so it lives in the kit; re-exported here
 * because consumers already import it from this package.
 */
export {
	scanCandidates,
	scanDeclaredClasses,
	scanFiles,
	scanSource,
	type ClassUse
} from '@myavenceo/aven-brandkit'
