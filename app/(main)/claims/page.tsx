export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import { getPublishedClaims, getCarriers } from '@/actions/claims'
import { ClaimCard, ClaimCardSkeleton } from '@/components/claim-card'
import { ClaimFilters } from '@/components/claim-filters'
import { Pagination } from '@/components/pagination'
import { Disclaimer } from '@/components/disclaimer'

interface PageProps {
  searchParams: Promise<{
    state?: string
    carrierId?: string
    policyType?: string
    lossType?: string
    sortBy?: string
    page?: string
  }>
}

// Placeholder claims for when database is empty
const PLACEHOLDER_CLAIMS = [
  {
    id: 'placeholder-1',
    status: 'PUBLISHED' as const,
    viewCount: 234,
    createdAt: new Date('2024-11-15'),
    carrierName: 'State Farm',
    state: 'MI',
    policyType: 'AUTO' as const,
    lossType: 'COLLISION' as const,
    dateOfLoss: 'October 2024',
    deniedFlag: false,
    appraisalFlag: false,
    litigationFlag: false,
  },
  {
    id: 'placeholder-2',
    status: 'PUBLISHED' as const,
    viewCount: 187,
    createdAt: new Date('2024-11-10'),
    carrierName: 'Allstate',
    state: 'MI',
    policyType: 'HO' as const,
    lossType: 'WATER' as const,
    dateOfLoss: 'September 2024',
    deniedFlag: false,
    appraisalFlag: true,
    litigationFlag: false,
  },
  {
    id: 'placeholder-3',
    status: 'PUBLISHED' as const,
    viewCount: 156,
    createdAt: new Date('2024-11-05'),
    carrierName: 'Progressive',
    state: 'MI',
    policyType: 'HO' as const,
    lossType: 'WIND' as const,
    dateOfLoss: 'August 2024',
    deniedFlag: true,
    appraisalFlag: false,
    litigationFlag: false,
  },
  {
    id: 'placeholder-4',
    status: 'PUBLISHED' as const,
    viewCount: 142,
    createdAt: new Date('2024-10-28'),
    carrierName: 'Auto-Owners',
    state: 'MI',
    policyType: 'AUTO' as const,
    lossType: 'COMPREHENSIVE' as const,
    dateOfLoss: 'October 2024',
    deniedFlag: false,
    appraisalFlag: false,
    litigationFlag: false,
  },
  {
    id: 'placeholder-5',
    status: 'PUBLISHED' as const,
    viewCount: 128,
    createdAt: new Date('2024-10-20'),
    carrierName: 'Farmers',
    state: 'MI',
    policyType: 'HO' as const,
    lossType: 'FIRE' as const,
    dateOfLoss: 'September 2024',
    deniedFlag: false,
    appraisalFlag: false,
    litigationFlag: true,
  },
  {
    id: 'placeholder-6',
    status: 'PUBLISHED' as const,
    viewCount: 98,
    createdAt: new Date('2024-10-15'),
    carrierName: 'Citizens Insurance',
    state: 'MI',
    policyType: 'HO' as const,
    lossType: 'WATER' as const,
    dateOfLoss: 'July 2024',
    deniedFlag: true,
    appraisalFlag: true,
    litigationFlag: false,
  },
]

async function ClaimsList({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const filters = {
    state: searchParams.state,
    carrierId: searchParams.carrierId,
    policyType: searchParams.policyType,
    lossType: searchParams.lossType,
    sortBy: searchParams.sortBy || 'newest',
    page: parseInt(searchParams.page || '1', 10),
    limit: 12,
  }

  const result = await getPublishedClaims(filters)

  // Use placeholder claims if database is empty and no filters applied
  const hasFilters = searchParams.state || searchParams.carrierId || searchParams.policyType || searchParams.lossType
  const claims = result.data.length === 0 && !hasFilters ? PLACEHOLDER_CLAIMS : result.data

  if (claims.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No claims found matching your criteria.</p>
        <p className="text-sm text-gray-400 mt-2">Try adjusting your filters.</p>
      </div>
    )
  }

  const isPlaceholder = result.data.length === 0

  return (
    <>
      {isPlaceholder && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            <strong>Sample Data:</strong> These are example claims to show how the platform works.
            Real claims will appear here once community members start sharing their experiences.
          </p>
        </div>
      )}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {claims.map((claim) => (
          <ClaimCard key={claim.id} claim={claim} />
        ))}
      </div>
      {!isPlaceholder && result.totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={result.page}
            totalPages={result.totalPages}
            basePath="/claims"
          />
        </div>
      )}
    </>
  )
}

function ClaimsListSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <ClaimCardSkeleton key={i} />
      ))}
    </div>
  )
}

export default async function ClaimsPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const carriers = await getCarriers()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Claims</h1>
        <p className="text-gray-600">
          Explore anonymized insurance claim experiences from our community.
        </p>
      </div>

      <div className="mb-6">
        <ClaimFilters carriers={carriers} />
      </div>

      <Suspense fallback={<ClaimsListSkeleton />}>
        <ClaimsList searchParams={resolvedSearchParams} />
      </Suspense>

      <div className="mt-12">
        <Disclaimer variant="compact" />
      </div>
    </div>
  )
}
