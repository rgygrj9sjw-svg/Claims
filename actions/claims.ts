'use server'

import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { sanitizeClaimSubmission } from '@/lib/sanitize'
import { moderateClaimSubmission } from '@/lib/moderation'
import { ClaimSubmissionSchema, ClaimFilterSchema } from '@/lib/validators'
import { ClaimCardData, ClaimWithRelations, PaginatedResult } from '@/types'
import { revalidatePath } from 'next/cache'

const MONTHS = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export async function submitClaim(data: unknown) {
  const user = await getCurrentUser()
  if (!user) {
    return { error: 'You must be logged in to submit a claim' }
  }

  // Validate input
  const validationResult = ClaimSubmissionSchema.safeParse(data)
  if (!validationResult.success) {
    return { error: validationResult.error.issues[0]?.message || 'Validation failed' }
  }

  const { metadata, timeline, outcome } = validationResult.data

  // Sanitize all text fields
  const sanitizedTimeline = timeline.map(event => ({
    ...event,
    notes: event.notes ? sanitizeClaimSubmission({ notes: event.notes }).notes : undefined,
  }))

  // Run moderation check
  const moderationResult = moderateClaimSubmission({
    timeline: sanitizedTimeline,
  })

  try {
    const claim = await prisma.claim.create({
      data: {
        userId: user.id,
        carrierId: metadata.carrierId,
        status: moderationResult.requiresReview ? 'PENDING_REVIEW' : 'PUBLISHED',
        flagReason: moderationResult.flagReason,
        metadata: {
          create: {
            state: metadata.state,
            policyType: metadata.policyType,
            lossType: metadata.lossType,
            dateOfLossMonth: metadata.dateOfLossMonth,
            dateOfLossYear: metadata.dateOfLossYear,
            propertyType: metadata.propertyType,
            occupancy: metadata.occupancy,
            mitigationDone: metadata.mitigationDone,
          },
        },
        timeline: {
          create: sanitizedTimeline.map(event => ({
            date: new Date(event.date),
            eventType: event.eventType,
            notesSanitized: event.notes,
          })),
        },
        outcome: {
          create: {
            initialPaymentAmount: outcome.initialPaymentAmount,
            finalPaymentAmount: outcome.finalPaymentAmount,
            deniedFlag: outcome.deniedFlag,
            partialFlag: outcome.partialFlag,
            appraisalFlag: outcome.appraisalFlag,
            litigationFlag: outcome.litigationFlag,
          },
        },
      },
    })

    revalidatePath('/claims')

    return {
      success: true,
      claimId: claim.id,
      status: claim.status,
      message: moderationResult.requiresReview
        ? 'Your claim has been submitted and is pending review.'
        : 'Your claim has been published successfully.',
    }
  } catch (error) {
    console.error('Error submitting claim:', error)
    return { error: 'Failed to submit claim. Please try again.' }
  }
}

export async function getPublishedClaims(
  filters: unknown
): Promise<PaginatedResult<ClaimCardData>> {
  const validationResult = ClaimFilterSchema.safeParse(filters)
  const parsedFilters = validationResult.success
    ? validationResult.data
    : { sortBy: 'newest' as const, page: 1, limit: 10 }

  const { state, carrierId, policyType, lossType, sortBy, page, limit } = parsedFilters

  const where = {
    status: 'PUBLISHED' as const,
    ...(carrierId && { carrierId }),
    ...(state && { metadata: { state } }),
    ...(policyType && { metadata: { policyType } }),
    ...(lossType && { metadata: { lossType } }),
  }

  const [claims, total] = await Promise.all([
    prisma.claim.findMany({
      where,
      include: {
        carrier: true,
        metadata: true,
        outcome: true,
      },
      orderBy: sortBy === 'mostViewed'
        ? { viewCount: 'desc' }
        : { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.claim.count({ where }),
  ])

  const data: ClaimCardData[] = claims.map(claim => ({
    id: claim.id,
    status: claim.status,
    viewCount: claim.viewCount,
    createdAt: claim.createdAt,
    carrierName: claim.carrier.name,
    state: claim.metadata?.state || 'N/A',
    policyType: claim.metadata?.policyType || 'HO',
    lossType: claim.metadata?.lossType || 'OTHER',
    dateOfLoss: claim.metadata
      ? `${MONTHS[claim.metadata.dateOfLossMonth]} ${claim.metadata.dateOfLossYear}`
      : 'N/A',
    deniedFlag: claim.outcome?.deniedFlag || false,
    appraisalFlag: claim.outcome?.appraisalFlag || false,
    litigationFlag: claim.outcome?.litigationFlag || false,
  }))

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

export async function getClaimById(id: string): Promise<ClaimWithRelations | null> {
  const claim = await prisma.claim.findUnique({
    where: { id, status: 'PUBLISHED' },
    include: {
      carrier: true,
      metadata: true,
      timeline: {
        orderBy: { date: 'asc' },
      },
      outcome: true,
    },
  })

  if (!claim) return null

  return {
    id: claim.id,
    status: claim.status,
    viewCount: claim.viewCount,
    createdAt: claim.createdAt,
    updatedAt: claim.updatedAt,
    carrier: {
      id: claim.carrier.id,
      name: claim.carrier.name,
      slug: claim.carrier.slug,
    },
    metadata: claim.metadata ? {
      state: claim.metadata.state,
      policyType: claim.metadata.policyType,
      lossType: claim.metadata.lossType,
      dateOfLossMonth: claim.metadata.dateOfLossMonth,
      dateOfLossYear: claim.metadata.dateOfLossYear,
      propertyType: claim.metadata.propertyType,
      occupancy: claim.metadata.occupancy,
      mitigationDone: claim.metadata.mitigationDone,
    } : null,
    timeline: claim.timeline.map(event => ({
      id: event.id,
      date: event.date,
      eventType: event.eventType,
      notesSanitized: event.notesSanitized,
    })),
    outcome: claim.outcome ? {
      initialPaymentAmount: claim.outcome.initialPaymentAmount,
      finalPaymentAmount: claim.outcome.finalPaymentAmount,
      deniedFlag: claim.outcome.deniedFlag,
      partialFlag: claim.outcome.partialFlag,
      appraisalFlag: claim.outcome.appraisalFlag,
      litigationFlag: claim.outcome.litigationFlag,
    } : null,
  }
}

export async function incrementViewCount(claimId: string) {
  await prisma.claim.update({
    where: { id: claimId },
    data: { viewCount: { increment: 1 } },
  })
}

export async function getCarriers() {
  return prisma.carrier.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, slug: true },
  })
}
