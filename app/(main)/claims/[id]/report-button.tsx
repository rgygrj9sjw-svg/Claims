'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createReport } from '@/actions/reports'
import { Flag, X } from 'lucide-react'

interface ReportButtonProps {
  claimId: string
}

export function ReportButton({ claimId }: ReportButtonProps) {
  const { data: session } = useSession()
  const [showModal, setShowModal] = useState(false)
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    const result = await createReport({ claimId, reason })

    if (result.error) {
      setMessage({ type: 'error', text: result.error })
    } else {
      setMessage({ type: 'success', text: result.message || 'Report submitted' })
      setTimeout(() => {
        setShowModal(false)
        setReason('')
        setMessage(null)
      }, 2000)
    }

    setIsSubmitting(false)
  }

  if (!session) {
    return null
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="text-gray-500 hover:text-gray-700"
        onClick={() => setShowModal(true)}
      >
        <Flag className="h-4 w-4 mr-1" />
        Report
      </Button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Report This Claim
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for reporting
                </label>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please describe why you're reporting this claim (e.g., inaccurate information, inappropriate content, privacy concerns)..."
                  rows={4}
                  required
                  minLength={10}
                  maxLength={1000}
                />
                <p className="mt-1 text-sm text-gray-500">
                  {reason.length}/1000 characters
                </p>
              </div>

              {message && (
                <div
                  className={`mb-4 p-3 rounded text-sm ${
                    message.type === 'success'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {message.text}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || reason.length < 10}
                  className="flex-1"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
