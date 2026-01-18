export const dynamic = 'force-dynamic'

import { getPendingClaims } from '@/actions/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ClaimActions } from './claim-actions'

const lossTypeLabels: Record<string, string> = {
  WATER: 'Water',
  FIRE: 'Fire',
  WIND: 'Wind',
  HAIL: 'Hail',
  THEFT: 'Theft',
  LIABILITY: 'Liability',
  OTHER: 'Other',
}

export default async function SubmissionsPage() {
  const claims = await getPendingClaims()

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pending Submissions</h1>
        <Badge variant="warning">{claims.length} pending</Badge>
      </div>

      {claims.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500">No pending submissions to review.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => (
            <Card key={claim.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {claim.carrier.name}
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      Submitted by {claim.user.email} on{' '}
                      {new Date(claim.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {claim.flagReason && (
                    <Badge variant="destructive">Flagged</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {claim.flagReason && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    <strong>Flag Reason:</strong> {claim.flagReason}
                  </div>
                )}

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">State</p>
                    <p className="font-medium">{claim.metadata?.state || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Loss Type</p>
                    <p className="font-medium">
                      {claim.metadata?.lossType
                        ? lossTypeLabels[claim.metadata.lossType]
                        : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Timeline Events</p>
                    <p className="font-medium">{claim.timeline.length}</p>
                  </div>
                </div>

                {claim.timeline.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Timeline Notes:</p>
                    <div className="space-y-2">
                      {claim.timeline
                        .filter(e => e.notesSanitized)
                        .map((event) => (
                          <div
                            key={event.id}
                            className="text-sm p-2 bg-gray-50 rounded"
                          >
                            <span className="font-medium">{event.eventType}:</span>{' '}
                            {event.notesSanitized}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                <ClaimActions claimId={claim.id} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
