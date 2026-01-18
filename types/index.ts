import { UserRole, ClaimStatus, PolicyType, LossType, EventType, ReportStatus } from '@prisma/client'

export type { UserRole, ClaimStatus, PolicyType, LossType, EventType, ReportStatus }

// Session user type (what we expose in the session)
export interface SessionUser {
  id: string
  email: string
  name: string | null
  role: UserRole
}

// Claim with relations for display
export interface ClaimWithRelations {
  id: string
  status: ClaimStatus
  viewCount: number
  createdAt: Date
  updatedAt: Date
  carrier: {
    id: string
    name: string
    slug: string
  }
  metadata: {
    state: string
    policyType: PolicyType
    lossType: LossType
    dateOfLossMonth: number
    dateOfLossYear: number
    propertyType: string | null
    occupancy: string | null
    mitigationDone: boolean
  } | null
  timeline: {
    id: string
    date: Date
    eventType: EventType
    notesSanitized: string | null
  }[]
  outcome: {
    initialPaymentAmount: number | null
    finalPaymentAmount: number | null
    deniedFlag: boolean
    partialFlag: boolean
    appraisalFlag: boolean
    litigationFlag: boolean
  } | null
}

// Claim card display (limited info for listings)
export interface ClaimCardData {
  id: string
  status: ClaimStatus
  viewCount: number
  createdAt: Date
  carrierName: string
  state: string
  policyType: PolicyType
  lossType: LossType
  dateOfLoss: string // "Month Year" format
  deniedFlag: boolean
  appraisalFlag: boolean
  litigationFlag: boolean
}

// Dashboard aggregate types
export interface DenialRateByCarrier {
  carrierName: string
  totalClaims: number
  deniedClaims: number
  denialRate: number
}

export interface ClaimsByLossType {
  lossType: LossType
  count: number
}

export interface ClaimsByState {
  state: string
  count: number
}

export interface TimelineStats {
  avgDaysToFirstContact: number
  avgDaysToResolution: number
  avgDaysToPayment: number
}

export interface PaymentStats {
  avgInitialPayment: number
  avgFinalPayment: number
  avgDifference: number
  claimsWithIncrease: number
}

// Pagination
export interface PaginatedResult<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Education article for display
export interface EducationArticleDisplay {
  id: string
  slug: string
  title: string
  category: string
  content: string
  lastReviewedDate: Date
  published: boolean
}

// Report with relations
export interface ReportWithRelations {
  id: string
  reason: string
  status: ReportStatus
  createdAt: Date
  claim: {
    id: string
    carrier: {
      name: string
    }
  }
  reporter: {
    email: string
  }
}

// Form step types for multi-step submission
export type SubmissionStep = 'intro' | 'metadata' | 'timeline' | 'review'

// Consent form data
export interface ConsentData {
  accuracyConfirmed: boolean
  noLegalAdvice: boolean
  termsAccepted: boolean
}
