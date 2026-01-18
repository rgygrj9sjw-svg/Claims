'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { publishClaim, rejectClaim, deleteClaim } from '@/actions/admin'
import { Check, X, Trash2 } from 'lucide-react'

interface ClaimActionsProps {
  claimId: string
}

export function ClaimActions({ claimId }: ClaimActionsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const handlePublish = async () => {
    setIsLoading(true)
    await publishClaim(claimId)
    router.refresh()
    setIsLoading(false)
  }

  const handleReject = async () => {
    if (!rejectReason.trim()) return
    setIsLoading(true)
    await rejectClaim(claimId, rejectReason)
    router.refresh()
    setIsLoading(false)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this claim? This cannot be undone.')) {
      return
    }
    setIsLoading(true)
    await deleteClaim(claimId)
    router.refresh()
    setIsLoading(false)
  }

  if (showRejectForm) {
    return (
      <div className="space-y-3">
        <Textarea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Reason for rejection..."
          rows={3}
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowRejectForm(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={isLoading || !rejectReason.trim()}
          >
            {isLoading ? 'Rejecting...' : 'Confirm Reject'}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <Button onClick={handlePublish} disabled={isLoading}>
        <Check className="h-4 w-4 mr-2" />
        {isLoading ? 'Publishing...' : 'Publish'}
      </Button>
      <Button
        variant="outline"
        onClick={() => setShowRejectForm(true)}
        disabled={isLoading}
      >
        <X className="h-4 w-4 mr-2" />
        Reject
      </Button>
      <Button
        variant="ghost"
        onClick={handleDelete}
        disabled={isLoading}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
