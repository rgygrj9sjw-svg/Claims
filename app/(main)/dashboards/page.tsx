export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import {
  getDashboardStats,
  getDenialRatesByCarrier,
  getClaimsByLossType,
  getClaimsByState,
  getPaymentStats,
} from '@/actions/dashboards'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Disclaimer } from '@/components/disclaimer'
import { DashboardCharts } from '@/components/charts/dashboard-charts'
import { formatCurrency } from '@/lib/utils'
import {
  FileText,
  XCircle,
  Scale,
  Gavel,
  DollarSign,
  TrendingUp,
} from 'lucide-react'

async function DashboardContent() {
  const [stats, denialRates, claimsByLoss, claimsByState, paymentStats] =
    await Promise.all([
      getDashboardStats(),
      getDenialRatesByCarrier(),
      getClaimsByLossType(),
      getClaimsByState(),
      getPaymentStats(),
    ])

  return (
    <>
      {/* Key Metrics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Claims</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalClaims}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Denial Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.denialRate}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <Scale className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Appraisal Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.appraisalRate}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Gavel className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Litigation Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.litigationRate}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Avg Initial Payment
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(paymentStats.avgInitialPayment)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Avg Final Payment
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(paymentStats.avgFinalPayment)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-teal-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  Avg Increase
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {paymentStats.avgDifference > 0 ? '+' : ''}
                  {formatCurrency(paymentStats.avgDifference)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <DashboardCharts
        denialRates={denialRates}
        claimsByLoss={claimsByLoss}
        claimsByState={claimsByState}
      />
    </>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="h-16 bg-gray-100 animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        {[1, 2].map(i => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 w-32 bg-gray-100 animate-pulse rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-100 animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function DashboardsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Claims Dashboard
        </h1>
        <p className="text-gray-600">
          Aggregate statistics and trends from crowdsourced insurance claim
          experiences.
        </p>
      </div>

      <div className="mb-6">
        <Disclaimer variant="compact" />
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  )
}
