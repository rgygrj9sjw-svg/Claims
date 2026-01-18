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

  if (result.data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No claims found matching your criteria.</p>
        <p className="text-sm text-gray-400 mt-2">Try adjusting your filters.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {result.data.map((claim) => (
          <ClaimCard key={claim.id} claim={claim} />
        ))}
      </div>
      <div className="mt-8">
        <Pagination
          currentPage={result.page}
          totalPages={result.totalPages}
          basePath="/claims"
        />
      </div>
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
