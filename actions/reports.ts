'use server'

import { prisma } from '@/lib/db'
import { getCurrentUser } from '@/lib/auth'
import { ReportSchema } from '@/lib/validators'
import { revalidatePath } from 'next/cache'

export async function createReport(data: unknown) {
  const user = await getCurrentUser()
  if (!user) {
    return { error: 'You must be logged in to report a claim' }
  }

  const validationResult = ReportSchema.safeParse(data)
  if (!validationResult.success) {
    return { error: validationResult.error.issues[0]?.message || 'Validation failed' }
  }

  const { claimId, reason } = validationResult.data

  // Check if claim exists
  const claim = await prisma.claim.findUnique({
    where: { id: claimId },
  })

  if (!claim) {
    return { error: 'Claim not found' }
  }

  // Check if user already reported this claim
  const existingReport = await prisma.report.findFirst({
    where: {
      claimId,
      reporterUserId: user.id,
    },
  })

  if (existingReport) {
    return { error: 'You have already reported this claim' }
  }

  try {
    await prisma.report.create({
      data: {
        claimId,
        reporterUserId: user.id,
        reason,
      },
    })

    return { success: true, message: 'Report submitted successfully' }
  } catch (error) {
    console.error('Error creating report:', error)
    return { error: 'Failed to submit report. Please try again.' }
  }
}

export async function getOpenReports() {
  return prisma.report.findMany({
    where: { status: 'OPEN' },
    include: {
      claim: {
        include: {
          carrier: true,
        },
      },
      reporter: {
        select: { email: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export async function resolveReport(reportId: string, action: 'reviewed' | 'action_taken') {
  const status = action === 'reviewed' ? 'REVIEWED' : 'ACTION_TAKEN'

  await prisma.report.update({
    where: { id: reportId },
    data: { status },
  })

  revalidatePath('/admin/reports')

  return { success: true }
}
