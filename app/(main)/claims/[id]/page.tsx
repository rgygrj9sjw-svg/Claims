export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { getClaimById, incrementViewCount } from '@/actions/claims'
import { ClaimTimeline } from '@/components/claim-timeline'
import { Disclaimer } from '@/components/disclaimer'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, getStateFullName } from '@/lib/utils'
import { ReportButton } from './report-button'
import {
  MapPin,
  Calendar,
  Building,
  AlertTriangle,
  DollarSign,
  Eye,
  Scale,
  Gavel,
  Home,
} from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
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

const MONTHS = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export default async function ClaimDetailPage({ params }: PageProps) {
  const { id } = await params
  const claim = await getClaimById(id)

  if (!claim) {
    notFound()
  }

  // Increment view count
  await incrementViewCount(id)

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {claim.carrier.name} Claim
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              {claim.metadata && (
                <>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {getStateFullName(claim.metadata.state)}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {MONTHS[claim.metadata.dateOfLossMonth]} {claim.metadata.dateOfLossYear}
                  </div>
                </>
              )}
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {claim.viewCount + 1} views
              </div>
            </div>
          </div>
          <ReportButton claimId={claim.id} />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Claim Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Claim Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {claim.metadata && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Carrier
                  </span>
                  <span className="font-medium">{claim.carrier.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Policy Type
                  </span>
                  <Badge variant="secondary">
                    {policyTypeLabels[claim.metadata.policyType]}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Loss Type
                  </span>
                  <Badge variant="outline">
                    {lossTypeLabels[claim.metadata.lossType]}
                  </Badge>
                </div>
                {claim.metadata.propertyType && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Property Type</span>
                    <span className="font-medium">{claim.metadata.propertyType}</span>
                  </div>
                )}
                {claim.metadata.occupancy && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Occupancy</span>
                    <span className="font-medium">{claim.metadata.occupancy}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Mitigation Done</span>
                  <span className="font-medium">
                    {claim.metadata.mitigationDone ? 'Yes' : 'No'}
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Outcome */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Outcome</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {claim.outcome && (
              <>
                {claim.outcome.initialPaymentAmount !== null && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Initial Payment
                    </span>
                    <span className="font-medium">
                      {formatCurrency(claim.outcome.initialPaymentAmount)}
                    </span>
                  </div>
                )}
                {claim.outcome.finalPaymentAmount !== null && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Final Payment
                    </span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(claim.outcome.finalPaymentAmount)}
                    </span>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 pt-2">
                  {claim.outcome.deniedFlag && (
                    <Badge variant="destructive">Denied</Badge>
                  )}
                  {claim.outcome.partialFlag && (
                    <Badge variant="warning">Partial Payment</Badge>
                  )}
                  {claim.outcome.appraisalFlag && (
                    <Badge variant="default" className="flex items-center gap-1">
                      <Scale className="h-3 w-3" />
                      Appraisal
                    </Badge>
                  )}
                  {claim.outcome.litigationFlag && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <Gavel className="h-3 w-3" />
                      Litigation
                    </Badge>
                  )}
                  {!claim.outcome.deniedFlag && !claim.outcome.partialFlag &&
                   !claim.outcome.appraisalFlag && !claim.outcome.litigationFlag && (
                    <Badge variant="success">Resolved</Badge>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Claim Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <ClaimTimeline events={claim.timeline} />
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Disclaimer />
    </div>
  )
}
