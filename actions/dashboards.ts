'use server'

import { prisma } from '@/lib/db'
import {
  DenialRateByCarrier,
  ClaimsByLossType,
  ClaimsByState,
  PaymentStats,
} from '@/types'

export async function getDashboardStats() {
  const [
    totalClaims,
    claimsWithDenials,
    claimsWithAppraisal,
    claimsWithLitigation,
  ] = await Promise.all([
    prisma.claim.count({ where: { status: 'PUBLISHED' } }),
    prisma.claimOutcome.count({ where: { deniedFlag: true, claim: { status: 'PUBLISHED' } } }),
    prisma.claimOutcome.count({ where: { appraisalFlag: true, claim: { status: 'PUBLISHED' } } }),
    prisma.claimOutcome.count({ where: { litigationFlag: true, claim: { status: 'PUBLISHED' } } }),
  ])

  return {
    totalClaims,
    denialRate: totalClaims > 0 ? (claimsWithDenials / totalClaims * 100).toFixed(1) : '0',
    appraisalRate: totalClaims > 0 ? (claimsWithAppraisal / totalClaims * 100).toFixed(1) : '0',
    litigationRate: totalClaims > 0 ? (claimsWithLitigation / totalClaims * 100).toFixed(1) : '0',
  }
}

export async function getDenialRatesByCarrier(): Promise<DenialRateByCarrier[]> {
  const carriers = await prisma.carrier.findMany({
    include: {
      claims: {
        where: { status: 'PUBLISHED' },
        include: { outcome: true },
      },
    },
  })

  return carriers
    .filter(carrier => carrier.claims.length > 0)
    .map(carrier => {
      const totalClaims = carrier.claims.length
      const deniedClaims = carrier.claims.filter(c => c.outcome?.deniedFlag).length
      return {
        carrierName: carrier.name,
        totalClaims,
        deniedClaims,
        denialRate: (deniedClaims / totalClaims) * 100,
      }
    })
    .sort((a, b) => b.totalClaims - a.totalClaims)
    .slice(0, 10)
}

export async function getClaimsByLossType(): Promise<ClaimsByLossType[]> {
  const claims = await prisma.claimMetadata.groupBy({
    by: ['lossType'],
    _count: { lossType: true },
    where: { claim: { status: 'PUBLISHED' } },
  })

  return claims.map(item => ({
    lossType: item.lossType,
    count: item._count.lossType,
  }))
}

export async function getClaimsByState(): Promise<ClaimsByState[]> {
  const claims = await prisma.claimMetadata.groupBy({
    by: ['state'],
    _count: { state: true },
    where: { claim: { status: 'PUBLISHED' } },
    orderBy: { _count: { state: 'desc' } },
    take: 10,
  })

  return claims.map(item => ({
    state: item.state,
    count: item._count.state,
  }))
}

export async function getPaymentStats(): Promise<PaymentStats> {
  const outcomes = await prisma.claimOutcome.findMany({
    where: {
      claim: { status: 'PUBLISHED' },
      finalPaymentAmount: { not: null },
    },
    select: {
      initialPaymentAmount: true,
      finalPaymentAmount: true,
    },
  })

  if (outcomes.length === 0) {
    return {
      avgInitialPayment: 0,
      avgFinalPayment: 0,
      avgDifference: 0,
      claimsWithIncrease: 0,
    }
  }

  const withInitial = outcomes.filter(o => o.initialPaymentAmount !== null)
  const avgInitialPayment = withInitial.length > 0
    ? withInitial.reduce((sum, o) => sum + (o.initialPaymentAmount || 0), 0) / withInitial.length
    : 0

  const avgFinalPayment = outcomes.reduce((sum, o) => sum + (o.finalPaymentAmount || 0), 0) / outcomes.length

  const claimsWithIncrease = withInitial.filter(
    o => (o.finalPaymentAmount || 0) > (o.initialPaymentAmount || 0)
  ).length

  return {
    avgInitialPayment: Math.round(avgInitialPayment),
    avgFinalPayment: Math.round(avgFinalPayment),
    avgDifference: Math.round(avgFinalPayment - avgInitialPayment),
    claimsWithIncrease,
  }
}

export async function getClaimsByMonth() {
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const claims = await prisma.claim.findMany({
    where: {
      status: 'PUBLISHED',
      createdAt: { gte: sixMonthsAgo },
    },
    select: {
      createdAt: true,
    },
  })

  // Group by month
  const byMonth: Record<string, number> = {}
  claims.forEach(claim => {
    const month = claim.createdAt.toISOString().slice(0, 7) // YYYY-MM
    byMonth[month] = (byMonth[month] || 0) + 1
  })

  return Object.entries(byMonth)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([month, count]) => ({
      month,
      count,
    }))
}
