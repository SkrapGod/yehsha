import deliveryZones from '@/lib/delivery-zones.json'

// Hard gate in front of payment: only an FSA explicitly marked 'deliver' passes.
// 'exclude', 'review', unknown values and FSAs missing from the data all block.
//
// Data: StatCan 2021 census approximation of FSAs (not Canada Post's own polygons),
// so FSAs on the zone edge can be wrong for individual addresses.

type Recommendation = 'deliver' | 'exclude' | 'review'

const zones = deliveryZones.zones as Record<string, Recommendation>

// FSAs still sitting at 'review' in the data. 'review' is not a real end state (there is
// no manual review step), so each needs an explicit deliver/exclude decision before
// launch. Until then they are blocked like 'exclude'.
export const UNRESOLVED_REVIEW_FSAS: string[] = Object.keys(zones).filter(
  (fsa) => zones[fsa] === 'review'
)

if (process.env.NODE_ENV !== 'production' && UNRESOLVED_REVIEW_FSAS.length > 0) {
  console.warn(
    `[postal-check] ${UNRESOLVED_REVIEW_FSAS.length} FSAs are unresolved ('review') and are ` +
      `blocked as a stopgap: ${UNRESOLVED_REVIEW_FSAS.join(', ')}. Decide deliver or exclude ` +
      `for each before launch.`
  )
}

// Canadian postal code: letter-digit-letter digit-letter-digit. First letter excludes
// D, F, I, O, Q, U, W, Z; the other letters exclude D, F, I, O, Q, U.
const POSTAL_CODE = /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z]\d[ABCEGHJ-NPRSTV-Z]\d$/

export type PostalCheckResult =
  | { deliverable: true; fsa: string; postalCode: string }
  | {
      deliverable: false
      reason: 'invalid-format' | 'outside-zone' | 'excluded' | 'unresolved-review'
      fsa: string | null
      postalCode: string | null
      message: string
    }

export const INVALID_MESSAGE = 'Enter a valid postal code, for example L9T 1A1.'
export const NOT_DELIVERED_MESSAGE = "We don't currently deliver to this postal code."

/** Uppercases and strips spaces/hyphens. Returns null unless it is a valid 6-character code. */
export function normalizePostalCode(input: string): string | null {
  const cleaned = input.toUpperCase().replace(/[\s-]/g, '')
  return POSTAL_CODE.test(cleaned) ? cleaned : null
}

/** First three characters of a normalized postal code. */
export function getFsa(postalCode: string): string {
  return postalCode.slice(0, 3)
}

export function checkPostalCode(input: string): PostalCheckResult {
  const postalCode = normalizePostalCode(input)
  if (!postalCode) {
    return {
      deliverable: false,
      reason: 'invalid-format',
      fsa: null,
      postalCode: null,
      message: INVALID_MESSAGE,
    }
  }

  const fsa = getFsa(postalCode)
  const recommendation = Object.hasOwn(zones, fsa) ? zones[fsa] : undefined

  if (recommendation === 'deliver') {
    return { deliverable: true, fsa, postalCode }
  }

  return {
    deliverable: false,
    reason:
      recommendation === undefined
        ? 'outside-zone'
        : recommendation === 'review'
          ? 'unresolved-review'
          : 'excluded',
    fsa,
    postalCode,
    message: NOT_DELIVERED_MESSAGE,
  }
}
