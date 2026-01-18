'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { US_STATES, getStateFullName } from '@/lib/utils'
import { X } from 'lucide-react'

interface Carrier {
  id: string
  name: string
}

interface ClaimFiltersProps {
  carriers: Carrier[]
}

const policyTypes = [
  { value: 'HO', label: 'Homeowners' },
  { value: 'RENTERS', label: 'Renters' },
  { value: 'AUTO', label: 'Auto' },
  { value: 'COMMERCIAL', label: 'Commercial' },
]

const lossTypes = [
  { value: 'WATER', label: 'Water' },
  { value: 'FIRE', label: 'Fire' },
  { value: 'WIND', label: 'Wind' },
  { value: 'HAIL', label: 'Hail' },
  { value: 'THEFT', label: 'Theft' },
  { value: 'LIABILITY', label: 'Liability' },
  { value: 'OTHER', label: 'Other' },
]

const sortOptions = [
  { value: 'newest', label: 'Newest First' },
  { value: 'mostViewed', label: 'Most Viewed' },
]

export function ClaimFilters({ carriers }: ClaimFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentState = searchParams.get('state') || ''
  const currentCarrier = searchParams.get('carrierId') || ''
  const currentPolicyType = searchParams.get('policyType') || ''
  const currentLossType = searchParams.get('lossType') || ''
  const currentSort = searchParams.get('sortBy') || 'newest'

  const hasFilters = currentState || currentCarrier || currentPolicyType || currentLossType

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page') // Reset to first page when filtering
    router.push(`/claims?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/claims')
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <Select
            value={currentState}
            onChange={(e) => updateFilter('state', e.target.value)}
          >
            <option value="">All States</option>
            {US_STATES.map((state) => (
              <option key={state} value={state}>
                {getStateFullName(state)}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Carrier
          </label>
          <Select
            value={currentCarrier}
            onChange={(e) => updateFilter('carrierId', e.target.value)}
          >
            <option value="">All Carriers</option>
            {carriers.map((carrier) => (
              <option key={carrier.id} value={carrier.id}>
                {carrier.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Policy Type
          </label>
          <Select
            value={currentPolicyType}
            onChange={(e) => updateFilter('policyType', e.target.value)}
          >
            <option value="">All Types</option>
            {policyTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loss Type
          </label>
          <Select
            value={currentLossType}
            onChange={(e) => updateFilter('lossType', e.target.value)}
          >
            <option value="">All Loss Types</option>
            {lossTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <Select
            value={currentSort}
            onChange={(e) => updateFilter('sortBy', e.target.value)}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  )
}
