import { z } from 'zod'

// Policy types
export const PolicyTypeEnum = z.enum(['HO', 'RENTERS', 'AUTO', 'COMMERCIAL'])
export type PolicyType = z.infer<typeof PolicyTypeEnum>

// Loss types
export const LossTypeEnum = z.enum(['WATER', 'FIRE', 'WIND', 'HAIL', 'THEFT', 'LIABILITY', 'OTHER'])
export type LossType = z.infer<typeof LossTypeEnum>

// Event types
export const EventTypeEnum = z.enum([
  'REPORTED', 'FIRST_CONTACT', 'INSPECTION', 'DENIAL',
  'PAYMENT', 'REOPENED', 'APPRAISAL', 'LITIGATION', 'OTHER'
])
export type EventType = z.infer<typeof EventTypeEnum>

// US States
const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
] as const

export const StateEnum = z.enum(US_STATES)

// Timeline event schema
export const TimelineEventSchema = z.object({
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  eventType: EventTypeEnum,
  notes: z.string().max(2000, 'Notes must be under 2000 characters').optional(),
})

export type TimelineEventInput = z.infer<typeof TimelineEventSchema>

// Claim metadata schema
export const ClaimMetadataSchema = z.object({
  state: StateEnum,
  carrierId: z.string().min(1, 'Carrier is required'),
  policyType: PolicyTypeEnum,
  lossType: LossTypeEnum,
  dateOfLossMonth: z.number().int().min(1).max(12),
  dateOfLossYear: z.number().int().min(1990).max(new Date().getFullYear()),
  propertyType: z.string().optional(),
  occupancy: z.string().optional(),
  mitigationDone: z.boolean().default(false),
})

export type ClaimMetadataInput = z.infer<typeof ClaimMetadataSchema>

// Claim outcome schema
export const ClaimOutcomeSchema = z.object({
  initialPaymentAmount: z.number().min(0).optional(),
  finalPaymentAmount: z.number().min(0).optional(),
  deniedFlag: z.boolean().default(false),
  partialFlag: z.boolean().default(false),
  appraisalFlag: z.boolean().default(false),
  litigationFlag: z.boolean().default(false),
})

export type ClaimOutcomeInput = z.infer<typeof ClaimOutcomeSchema>

// Full claim submission schema
export const ClaimSubmissionSchema = z.object({
  metadata: ClaimMetadataSchema,
  timeline: z.array(TimelineEventSchema).min(1, 'At least one timeline event is required'),
  outcome: ClaimOutcomeSchema,
  consent: z.object({
    accuracyConfirmed: z.literal(true, { message: 'You must confirm the information is accurate' }),
    noLegalAdvice: z.literal(true, { message: 'You must acknowledge this is not legal advice' }),
    termsAccepted: z.literal(true, { message: 'You must accept the terms of service' }),
  }),
})

export type ClaimSubmissionInput = z.infer<typeof ClaimSubmissionSchema>

// Report schema
export const ReportSchema = z.object({
  claimId: z.string().min(1, 'Claim ID is required'),
  reason: z.string().min(10, 'Please provide more detail about the issue').max(1000),
})

export type ReportInput = z.infer<typeof ReportSchema>

// Education article schema
export const EducationArticleSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  title: z.string().min(1).max(200),
  category: z.string().min(1).max(50),
  content: z.string().min(1),
  published: z.boolean().default(false),
})

export type EducationArticleInput = z.infer<typeof EducationArticleSchema>

// User registration schema
export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().min(1).max(100).optional(),
})

export type RegisterInput = z.infer<typeof RegisterSchema>

// Login schema
export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginInput = z.infer<typeof LoginSchema>

// Filter schema for browsing claims
export const ClaimFilterSchema = z.object({
  state: StateEnum.optional(),
  carrierId: z.string().optional(),
  policyType: PolicyTypeEnum.optional(),
  lossType: LossTypeEnum.optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  sortBy: z.enum(['newest', 'mostViewed']).default('newest'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(10),
})

export type ClaimFilterInput = z.infer<typeof ClaimFilterSchema>
