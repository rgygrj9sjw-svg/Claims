import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ClaimCardData } from '@/types'
import { Eye, Calendar, MapPin } from 'lucide-react'

interface ClaimCardProps {
  claim: ClaimCardData
}

const lossTypeLabels: Record<string, string> = {
  WATER: 'Water',
  FIRE: 'Fire',
  WIND: 'Wind',
  HAIL: 'Hail',
  THEFT: 'Theft',
  LIABILITY: 'Liability',
  OTHER: 'Other',
}

const policyTypeLabels: Record<string, string> = {
  HO: 'Homeowners',
  RENTERS: 'Renters',
  AUTO: 'Auto',
  COMMERCIAL: 'Commercial',
}

export function ClaimCard({ claim }: ClaimCardProps) {
  return (
    <Link href={`/claims/${claim.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold text-gray-900">{claim.carrierName}</p>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                <MapPin className="h-3.5 w-3.5" />
                <span>{claim.state}</span>
                <span className="text-gray-300">|</span>
                <Calendar className="h-3.5 w-3.5" />
                <span>{claim.dateOfLoss}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Eye className="h-4 w-4" />
              <span>{claim.viewCount}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              {policyTypeLabels[claim.policyType] || claim.policyType}
            </Badge>
            <Badge variant="outline">
              {lossTypeLabels[claim.lossType] || claim.lossType}
            </Badge>
            {claim.deniedFlag && (
              <Badge variant="destructive">Denied</Badge>
            )}
            {claim.appraisalFlag && (
              <Badge variant="warning">Appraisal</Badge>
            )}
            {claim.litigationFlag && (
              <Badge variant="destructive">Litigation</Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export function ClaimCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-24 bg-gray-100 rounded animate-pulse mt-2" />
          </div>
          <div className="h-4 w-12 bg-gray-100 rounded animate-pulse" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <div className="h-5 w-20 bg-gray-100 rounded animate-pulse" />
          <div className="h-5 w-16 bg-gray-100 rounded animate-pulse" />
        </div>
      </CardContent>
    </Card>
  )
}
