export const dynamic = 'force-dynamic'

import { getOpenReports } from '@/actions/reports'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ReportActions } from './report-actions'
import Link from 'next/link'

export default async function ReportsPage() {
  const reports = await getOpenReports()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Open Reports</h1>
        <Badge variant="destructive">{reports.length} open</Badge>
      </div>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No open reports to review.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Report on {report.claim.carrier.name} Claim
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      Reported by {report.reporter.email} on{' '}
                      {new Date(report.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Link
                    href={`/claims/${report.claim.id}`}
                    target="_blank"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View Claim
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4 p-3 bg-gray-50 rounded">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Report Reason:
                  </p>
                  <p className="text-sm text-gray-600">{report.reason}</p>
                </div>

                <ReportActions reportId={report.id} claimId={report.claim.id} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
