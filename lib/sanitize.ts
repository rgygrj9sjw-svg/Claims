/**
 * PII Sanitization Module
 * Detects and redacts personally identifiable information from text.
 */

// Email pattern
const EMAIL_PATTERN = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g

// Phone patterns (various US formats)
const PHONE_PATTERNS = [
  /\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g,  // 123-456-7890, 123.456.7890, 123 456 7890
  /\(\d{3}\)\s*\d{3}[-.\s]?\d{4}/g,       // (123) 456-7890
  /\b1[-.\s]?\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b/g, // 1-123-456-7890
]

// Policy/claim number patterns (long digit sequences)
const POLICY_NUMBER_PATTERN = /\b\d{8,}\b/g

// Street address pattern (number followed by street name)
const ADDRESS_PATTERN = /\b\d{1,5}\s+(?:[NSEW]\s+)?(?:\w+\s+){1,3}(?:Street|St|Avenue|Ave|Boulevard|Blvd|Drive|Dr|Road|Rd|Lane|Ln|Way|Court|Ct|Circle|Cir|Place|Pl)\.?\b/gi

// Name patterns near identifying keywords
const NAME_KEYWORDS = [
  'adjuster', 'agent', 'representative', 'rep', 'manager',
  'supervisor', 'mr.', 'mrs.', 'ms.', 'named', 'name is',
  'spoke with', 'spoke to', 'talked to', 'contacted by'
]

// Pattern to match names after keywords (capitalized words)
function createNamePattern(keyword: string): RegExp {
  return new RegExp(`${keyword}\\s+([A-Z][a-z]+(?:\\s+[A-Z][a-z]+)?)`, 'gi')
}

// SSN pattern
const SSN_PATTERN = /\b\d{3}[-\s]?\d{2}[-\s]?\d{4}\b/g

// Date of birth pattern with context
const DOB_PATTERN = /\b(?:DOB|date of birth|born on|birthday)[\s:]*\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4}/gi

/**
 * Sanitizes text by replacing PII with [REDACTED]
 */
export function sanitizeText(text: string): string {
  if (!text) return text

  let sanitized = text

  // Redact emails
  sanitized = sanitized.replace(EMAIL_PATTERN, '[REDACTED EMAIL]')

  // Redact phone numbers
  for (const pattern of PHONE_PATTERNS) {
    sanitized = sanitized.replace(pattern, '[REDACTED PHONE]')
  }

  // Redact SSNs
  sanitized = sanitized.replace(SSN_PATTERN, '[REDACTED SSN]')

  // Redact policy/claim numbers
  sanitized = sanitized.replace(POLICY_NUMBER_PATTERN, '[REDACTED NUMBER]')

  // Redact addresses
  sanitized = sanitized.replace(ADDRESS_PATTERN, '[REDACTED ADDRESS]')

  // Redact DOB
  sanitized = sanitized.replace(DOB_PATTERN, '[REDACTED DOB]')

  // Redact names near keywords
  for (const keyword of NAME_KEYWORDS) {
    const namePattern = createNamePattern(keyword)
    sanitized = sanitized.replace(namePattern, (match, name) => {
      return match.replace(name, '[REDACTED NAME]')
    })
  }

  return sanitized
}

/**
 * Checks if text contains potential PII
 */
export function containsPII(text: string): { hasPII: boolean; types: string[] } {
  if (!text) return { hasPII: false, types: [] }

  const types: string[] = []

  if (EMAIL_PATTERN.test(text)) types.push('email')
  if (PHONE_PATTERNS.some(p => p.test(text))) types.push('phone')
  if (SSN_PATTERN.test(text)) types.push('ssn')
  if (POLICY_NUMBER_PATTERN.test(text)) types.push('policy_number')
  if (ADDRESS_PATTERN.test(text)) types.push('address')
  if (DOB_PATTERN.test(text)) types.push('dob')

  // Reset lastIndex for global patterns
  EMAIL_PATTERN.lastIndex = 0
  SSN_PATTERN.lastIndex = 0
  POLICY_NUMBER_PATTERN.lastIndex = 0
  ADDRESS_PATTERN.lastIndex = 0
  DOB_PATTERN.lastIndex = 0
  PHONE_PATTERNS.forEach(p => p.lastIndex = 0)

  return { hasPII: types.length > 0, types }
}

/**
 * Sanitizes all text fields in a claim submission
 */
export function sanitizeClaimSubmission<T extends Record<string, unknown>>(data: T): T {
  const sanitized = { ...data }

  for (const key in sanitized) {
    const value = sanitized[key]
    if (typeof value === 'string') {
      (sanitized as Record<string, unknown>)[key] = sanitizeText(value)
    } else if (Array.isArray(value)) {
      (sanitized as Record<string, unknown>)[key] = value.map(item => {
        if (typeof item === 'string') {
          return sanitizeText(item)
        } else if (typeof item === 'object' && item !== null) {
          return sanitizeClaimSubmission(item as Record<string, unknown>)
        }
        return item
      })
    } else if (typeof value === 'object' && value !== null) {
      (sanitized as Record<string, unknown>)[key] = sanitizeClaimSubmission(value as Record<string, unknown>)
    }
  }

  return sanitized
}
