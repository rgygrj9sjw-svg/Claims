/**
 * Content Moderation Module
 * Checks for profanity and potentially defamatory content.
 */

import { Filter } from 'bad-words'

// Initialize the bad-words filter
const profanityFilter = new Filter()

// Defamation-related keywords that should trigger review
const DEFAMATION_KEYWORDS = [
  'fraud',
  'fraudster',
  'fraudulent',
  'scam',
  'scammer',
  'scamming',
  'criminal',
  'liar',
  'lying',
  'thief',
  'steal',
  'stealing',
  'stole',
  'crook',
  'crooked',
  'con artist',
  'conman',
  'corrupt',
  'corruption',
  'bribery',
  'bribed',
  'extortion',
  'blackmail',
  'illegal',
  'illegally',
  'embezzle',
  'embezzlement',
]

// Context that makes defamation more likely (naming + accusation)
const ACCUSATION_CONTEXTS = [
  'is a',
  'are',
  'was',
  'were',
  'committed',
  'engaged in',
]

export interface ModerationResult {
  clean: boolean
  flaggedWords: string[]
  flagReason?: string
  requiresReview: boolean
}

/**
 * Check text for profanity
 */
function checkProfanity(text: string): string[] {
  const flagged: string[] = []
  const words = text.toLowerCase().split(/\s+/)

  for (const word of words) {
    if (profanityFilter.isProfane(word)) {
      flagged.push(word)
    }
  }

  return flagged
}

/**
 * Check text for defamation keywords
 */
function checkDefamation(text: string): string[] {
  const flagged: string[] = []
  const lowerText = text.toLowerCase()

  for (const keyword of DEFAMATION_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      flagged.push(keyword)
    }
  }

  return flagged
}

/**
 * Determine if the defamation context is likely to be accusatory
 */
function hasAccusatoryContext(text: string, defamationKeywords: string[]): boolean {
  const lowerText = text.toLowerCase()

  for (const keyword of defamationKeywords) {
    for (const context of ACCUSATION_CONTEXTS) {
      // Check if defamation keyword appears near accusatory context
      const pattern = new RegExp(`${context}\\s+(?:\\w+\\s+){0,3}${keyword}`, 'i')
      if (pattern.test(lowerText)) {
        return true
      }
    }
  }

  return false
}

/**
 * Main moderation function - checks text for inappropriate content
 */
export function moderateContent(text: string): ModerationResult {
  if (!text || text.trim().length === 0) {
    return {
      clean: true,
      flaggedWords: [],
      requiresReview: false,
    }
  }

  const profanityFlags = checkProfanity(text)
  const defamationFlags = checkDefamation(text)

  const allFlags = [...new Set([...profanityFlags, ...defamationFlags])]

  // Determine if review is required
  let requiresReview = false
  let flagReason: string | undefined

  if (profanityFlags.length > 0) {
    requiresReview = true
    flagReason = `Profanity detected: ${profanityFlags.join(', ')}`
  }

  if (defamationFlags.length > 0) {
    const isAccusatory = hasAccusatoryContext(text, defamationFlags)
    if (isAccusatory) {
      requiresReview = true
      flagReason = flagReason
        ? `${flagReason}; Potentially defamatory: ${defamationFlags.join(', ')}`
        : `Potentially defamatory language: ${defamationFlags.join(', ')}`
    } else {
      // Non-accusatory use of defamation keywords might still warrant review
      // but with lower priority
      if (!requiresReview && defamationFlags.length >= 2) {
        requiresReview = true
        flagReason = `Multiple sensitive keywords: ${defamationFlags.join(', ')}`
      }
    }
  }

  return {
    clean: allFlags.length === 0,
    flaggedWords: allFlags,
    flagReason,
    requiresReview,
  }
}

/**
 * Moderate all text fields in a claim submission
 */
export function moderateClaimSubmission(data: Record<string, unknown>): ModerationResult {
  const results: ModerationResult[] = []

  function processValue(value: unknown): void {
    if (typeof value === 'string') {
      results.push(moderateContent(value))
    } else if (Array.isArray(value)) {
      value.forEach(processValue)
    } else if (typeof value === 'object' && value !== null) {
      Object.values(value).forEach(processValue)
    }
  }

  processValue(data)

  // Combine all results
  const allFlaggedWords = [...new Set(results.flatMap(r => r.flaggedWords))]
  const anyRequiresReview = results.some(r => r.requiresReview)
  const flagReasons = results.filter(r => r.flagReason).map(r => r.flagReason)

  return {
    clean: allFlaggedWords.length === 0,
    flaggedWords: allFlaggedWords,
    flagReason: flagReasons.length > 0 ? flagReasons.join('; ') : undefined,
    requiresReview: anyRequiresReview,
  }
}
