'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { resolveReport } from '@/actions/reports'
import { deleteClaim } from '@/actions/admin'
import { Check, AlertTriangle, Trash2 } from 'lucide-react'

interface ReportActionsProps {
  reportId: string
  claimId: string
}

export function ReportActions({ reportId, claimId }: ReportActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleReviewed = async () => {
    setIsLoading(true)
    await resolveReport(reportId, 'reviewed')
    router.refresh()
    setIsLoading(false)
  }

  const handleActionTaken = async () => {
    setIsLoading(true)
    await resolveReport(reportId, 'action_taken')
    router.refresh()
    setIsLoading(false)
  }

  const handleDeleteClaim = async () => {
    if (!confirm('Are you sure you want to delete this claim? This will also close the report.')) {
      return
    }
    setIsLoading(true)
    await deleteClaim(claimId)
    router.refresh()
    setIsLoading(false)
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={handleReviewed}
        disabled={isLoading}
      >
        <Check className="h-4 w-4 mr-2" />
        Mark Reviewed
      </Button>
      <Button onClick={handleActionTaken} disabled={isLoading}>
        <AlertTriangle className="h-4 w-4 mr-2" />
        Action Taken
      </Button>
      <Button
        variant="destructive"
        onClick={handleDeleteClaim}
        disabled={isLoading}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete Claim
      </Button>
    </div>
  )
}
