'use client'

import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { US_STATES, getStateFullName } from '@/lib/utils'
import type { ClaimMetadataInput } from '@/lib/validators'

interface MetadataStepProps {
  metadata: Partial<ClaimMetadataInput>
  carriers: { id: string; name: string }[]
  onUpdate: (metadata: Partial<ClaimMetadataInput>) => void
  onNext: () => void
  onBack: () => void
}

const policyTypes = [
  { value: 'HO', label: 'Homeowners' },
  { value: 'RENTERS', label: 'Renters' },
  { value: 'AUTO', label: 'Auto' },
  { value: 'COMMERCIAL', label: 'Commercial' },
]

const lossTypes = [
  { value: 'WATER', label: 'Water Damage' },
  { value: 'FIRE', label: 'Fire Damage' },
  { value: 'WIND', label: 'Wind Damage' },
  { value: 'HAIL', label: 'Hail Damage' },
  { value: 'THEFT', label: 'Theft' },
  { value: 'LIABILITY', label: 'Liability' },
  { value: 'OTHER', label: 'Other' },
]

const propertyTypes = [
  'Single Family',
  'Condo',
  'Townhouse',
  'Apartment',
  'Mobile Home',
  'Other',
]

const occupancyTypes = [
  'Owner Occupied',
  'Rental Property',
  'Vacant',
  'Secondary/Vacation Home',
]

const months = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
]

const currentYear = new Date().getFullYear()
const years = Array.from({ length: currentYear - 1990 + 1 }, (_, i) => currentYear - i)

export function MetadataStep({
  metadata,
  carriers,
  onUpdate,
  onNext,
  onBack,
}: MetadataStepProps) {
  const isValid =
    metadata.state &&
    metadata.carrierId &&
    metadata.policyType &&
    metadata.lossType &&
    metadata.dateOfLossMonth &&
    metadata.dateOfLossYear

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">
        Provide general information about your claim. This helps others find
        relevant experiences.
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="state">State *</Label>
          <Select
            id="state"
            value={metadata.state || ''}
            onChange={(e) =>
              onUpdate({ ...metadata, state: e.target.value as ClaimMetadataInput['state'] })
            }
          >
            <option value="">Select state</option>
            {US_STATES.map((state) => (
              <option key={state} value={state}>
                {getStateFullName(state)}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="carrier">Insurance Carrier *</Label>
          <Select
            id="carrier"
            value={metadata.carrierId || ''}
            onChange={(e) =>
              onUpdate({ ...metadata, carrierId: e.target.value })
            }
          >
            <option value="">Select carrier</option>
            {carriers.map((carrier) => (
              <option key={carrier.id} value={carrier.id}>
                {carrier.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="policyType">Policy Type *</Label>
          <Select
            id="policyType"
            value={metadata.policyType || ''}
            onChange={(e) =>
              onUpdate({ ...metadata, policyType: e.target.value as ClaimMetadataInput['policyType'] })
            }
          >
            <option value="">Select policy type</option>
            {policyTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="lossType">Loss Type *</Label>
          <Select
            id="lossType"
            value={metadata.lossType || ''}
            onChange={(e) =>
              onUpdate({ ...metadata, lossType: e.target.value as ClaimMetadataInput['lossType'] })
            }
          >
            <option value="">Select loss type</option>
            {lossTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="dateOfLossMonth">Date of Loss - Month *</Label>
          <Select
            id="dateOfLossMonth"
            value={metadata.dateOfLossMonth || ''}
            onChange={(e) =>
              onUpdate({ ...metadata, dateOfLossMonth: parseInt(e.target.value, 10) })
            }
          >
            <option value="">Select month</option>
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="dateOfLossYear">Date of Loss - Year *</Label>
          <Select
            id="dateOfLossYear"
            value={metadata.dateOfLossYear || ''}
            onChange={(e) =>
              onUpdate({ ...metadata, dateOfLossYear: parseInt(e.target.value, 10) })
            }
          >
            <option value="">Select year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
        </div>

        {(metadata.policyType === 'HO' || metadata.policyType === 'RENTERS') && (
          <>
            <div>
              <Label htmlFor="propertyType">Property Type (Optional)</Label>
              <Select
                id="propertyType"
                value={metadata.propertyType || ''}
                onChange={(e) =>
                  onUpdate({ ...metadata, propertyType: e.target.value || undefined })
                }
              >
                <option value="">Select property type</option>
                {propertyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="occupancy">Occupancy (Optional)</Label>
              <Select
                id="occupancy"
                value={metadata.occupancy || ''}
                onChange={(e) =>
                  onUpdate({ ...metadata, occupancy: e.target.value || undefined })
                }
              >
                <option value="">Select occupancy</option>
                {occupancyTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Select>
            </div>
          </>
        )}
      </div>

      <div>
        <Checkbox
          checked={metadata.mitigationDone || false}
          onChange={(e) =>
            onUpdate({ ...metadata, mitigationDone: e.target.checked })
          }
          label="Emergency mitigation was performed (e.g., water extraction, board-up, tarp)"
        />
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!isValid}>
          Continue
        </Button>
      </div>
    </div>
  )
}
