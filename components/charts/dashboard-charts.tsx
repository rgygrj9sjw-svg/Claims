'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DenialRateByCarrier, ClaimsByLossType, ClaimsByState } from '@/types'
import { getStateFullName } from '@/lib/utils'

interface DashboardChartsProps {
  denialRates: DenialRateByCarrier[]
  claimsByLoss: ClaimsByLossType[]
  claimsByState: ClaimsByState[]
}

const COLORS = [
  '#3b82f6', // blue
  '#22c55e', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#84cc16', // lime
  '#f97316', // orange
  '#14b8a6', // teal
]

const lossTypeLabels: Record<string, string> = {
  WATER: 'Water',
  FIRE: 'Fire',
  WIND: 'Wind',
  HAIL: 'Hail',
  THEFT: 'Theft',
  LIABILITY: 'Liability',
  OTHER: 'Other',
}

export function DashboardCharts({
  denialRates,
  claimsByLoss,
  claimsByState,
}: DashboardChartsProps) {
  const lossTypeData = claimsByLoss.map(item => ({
    name: lossTypeLabels[item.lossType] || item.lossType,
    value: item.count,
  }))

  const stateData = claimsByState.map(item => ({
    state: item.state,
    name: getStateFullName(item.state),
    claims: item.count,
  }))

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Denial Rate by Carrier */}
        <Card>
          <CardHeader>
            <CardTitle>Denial Rate by Carrier</CardTitle>
          </CardHeader>
          <CardContent>
            {denialRates.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={denialRates}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="carrierName"
                    width={75}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value) => [`${(value as number).toFixed(1)}%`, 'Denial Rate']}
                    labelFormatter={(label) => String(label)}
                  />
                  <Bar dataKey="denialRate" fill="#ef4444" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Claims by Loss Type */}
        <Card>
          <CardHeader>
            <CardTitle>Claims by Loss Type</CardTitle>
          </CardHeader>
          <CardContent>
            {lossTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={lossTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                  >
                    {lossTypeData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Claims by State */}
      <Card>
        <CardHeader>
          <CardTitle>Top States by Claim Volume</CardTitle>
        </CardHeader>
        <CardContent>
          {stateData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={stateData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="state" />
                <YAxis />
                <Tooltip
                  labelFormatter={(label) => {
                    const item = stateData.find(s => s.state === label)
                    return item?.name || label
                  }}
                />
                <Bar dataKey="claims" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data note */}
      <p className="text-sm text-gray-500 text-center">
        Data shown represents aggregate patterns from crowdsourced submissions
        and may not reflect overall industry statistics.
      </p>
    </div>
  )
}
