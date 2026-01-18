'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Disclaimer } from '@/components/disclaimer'
import { formatCurrency, getStateFullName } from '@/lib/utils'
import { Pencil } from 'lucide-react'
import type { ClaimMetadataInput, ClaimOutcomeInput, TimelineEventInput } from '@/lib/validators'
import type { ConsentData } from '@/types'

interface ReviewStepProps {
  formData: {
    consent: ConsentData
    metadata: Partial<ClaimMetadataInput>
    timeline: TimelineEventInput[]
    outcome: Partial<ClaimOutcomeInput>
  }
  carriers: { id: string; name: string }[]
  isSubmitting: boolean
  onSubmit: () => void
  onBack: () => void
  onEdit: (step: 'intro' | 'metadata' | 'timeline') => void
}

const policyTypeLabels: Record<string, string> = {
  HO: 'Homeowners',
  RENTERS: 'Renters',
  AUTO: 'Auto',
  COMMERCIAL: 'Commercial',
}

const lossTypeLabels: Record<string, string> = {
  WATER: 'Water Damage',
  FIRE: 'Fire Damage',
  WIND: 'Wind Damage',
  HAIL: 'Hail Damage',
  THEFT: 'Theft',
  LIABILITY: 'Liability',
  OTHER: 'Other',
}

const eventTypeLabels: Record<string, string> = {
  REPORTED: 'Claim Reported',
  FIRST_CONTACT: 'First Contact',
  INSPECTION: 'Inspection',
  DENIAL: 'Denial',
  PAYMENT: 'Payment',
  REOPENED: 'Reopened',
  APPRAISAL: 'Appraisal',
  LITIGATION: 'Litigation',
  OTHER: 'Other',
}

const MONTHS = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export function ReviewStep({
  formData,
  carriers,
  isSubmitting,
  onSubmit,
  onBack,
  onEdit,
}: ReviewStepProps) {
  const { metadata, timeline, outcome } = formData
  const carrier = carriers.find(c => c.id === metadata.carrierId)

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-600">
        Please review your submission before submitting. You can edit any
        section by clicking the edit button.
      </p>

      {/* Claim Details */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle className="text-base">Claim Details</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit('metadata')}
          >
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="pt-0">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-gray-500">State</dt>
              <dd className="font-medium">
                {metadata.state ? getStateFullName(metadata.state) : 'N/A'}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Carrier</dt>
              <dd className="font-medium">{carrier?.name || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Policy Type</dt>
              <dd>
                <Badge variant="secondary">
                  {metadata.policyType
                    ? policyTypeLabels[metadata.policyType]
                    : 'N/A'}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Loss Type</dt>
              <dd>
                <Badge variant="outline">
                  {metadata.lossType
                    ? lossTypeLabels[metadata.lossType]
                    : 'N/A'}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Date of Loss</dt>
              <dd className="font-medium">
                {metadata.dateOfLossMonth && metadata.dateOfLossYear
                  ? `${MONTHS[metadata.dateOfLossMonth]} ${metadata.dateOfLossYear}`
                  : 'N/A'}
              </dd>
            </div>
            {metadata.propertyType && (
              <div>
                <dt className="text-gray-500">Property Type</dt>
                <dd className="font-medium">{metadata.propertyType}</dd>
              </div>
            )}
          </dl>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle className="text-base">
            Timeline ({timeline.length} events)
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit('timeline')}
          >
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="space-y-2 text-sm">
            {timeline.map((event, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-gray-500 w-24 flex-shrink-0">
                  {new Date(event.date).toLocaleDateString()}
                </span>
                <span className="font-medium">
                  {eventTypeLabels[event.eventType]}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Outcome */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle className="text-base">Outcome</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit('timeline')}
          >
            <Pencil className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </CardHeader>
        <CardContent className="pt-0">
          <dl className="grid grid-cols-2 gap-4 text-sm">
            {outcome.initialPaymentAmount !== undefined && (
              <div>
                <dt className="text-gray-500">Initial Payment</dt>
                <dd className="font-medium">
                  {formatCurrency(outcome.initialPaymentAmount)}
                </dd>
              </div>
            )}
            {outcome.finalPaymentAmount !== undefined && (
              <div>
                <dt className="text-gray-500">Final Payment</dt>
                <dd className="font-medium text-green-600">
                  {formatCurrency(outcome.finalPaymentAmount)}
                </dd>
              </div>
            )}
          </dl>
          <div className="flex flex-wrap gap-2 mt-4">
            {outcome.deniedFlag && <Badge variant="destructive">Denied</Badge>}
            {outcome.partialFlag && <Badge variant="warning">Partial</Badge>}
            {outcome.appraisalFlag && <Badge>Appraisal</Badge>}
            {outcome.litigationFlag && (
              <Badge variant="destructive">Litigation</Badge>
            )}
            {!outcome.deniedFlag &&
              !outcome.partialFlag &&
              !outcome.appraisalFlag &&
              !outcome.litigationFlag && (
                <Badge variant="success">Standard Resolution</Badge>
              )}
          </div>
        </CardContent>
      </Card>

      <Disclaimer variant="compact" />

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Claim Experience'}
        </Button>
      </div>
    </div>
  )
}
