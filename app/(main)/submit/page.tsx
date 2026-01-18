'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { IntroStep } from '@/components/submit-form/intro-step'
import { MetadataStep } from '@/components/submit-form/metadata-step'
import { TimelineStep } from '@/components/submit-form/timeline-step'
import { ReviewStep } from '@/components/submit-form/review-step'
import { submitClaim, getCarriers } from '@/actions/claims'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import type { ClaimMetadataInput, ClaimOutcomeInput, TimelineEventInput } from '@/lib/validators'
import type { ConsentData } from '@/types'

type Step = 'intro' | 'metadata' | 'timeline' | 'review'

interface FormData {
  consent: ConsentData
  metadata: Partial<ClaimMetadataInput>
  timeline: TimelineEventInput[]
  outcome: Partial<ClaimOutcomeInput>
}

const initialFormData: FormData = {
  consent: {
    accuracyConfirmed: false,
    noLegalAdvice: false,
    termsAccepted: false,
  },
  metadata: {},
  timeline: [],
  outcome: {
    deniedFlag: false,
    partialFlag: false,
    appraisalFlag: false,
    litigationFlag: false,
  },
}

interface Carrier {
  id: string
  name: string
  slug: string
}

export default function SubmitPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>('intro')
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [carriers, setCarriers] = useState<Carrier[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitResult, setSubmitResult] = useState<{
    success?: boolean
    message?: string
    error?: string
  } | null>(null)

  useEffect(() => {
    getCarriers().then(setCarriers)
  }, [])

  const steps: { key: Step; label: string }[] = [
    { key: 'intro', label: 'Introduction' },
    { key: 'metadata', label: 'Claim Details' },
    { key: 'timeline', label: 'Timeline & Outcome' },
    { key: 'review', label: 'Review & Submit' },
  ]

  const currentStepIndex = steps.findIndex(s => s.key === currentStep)

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].key)
    }
  }

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].key)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitResult(null)

    const result = await submitClaim({
      metadata: formData.metadata,
      timeline: formData.timeline,
      outcome: formData.outcome,
      consent: formData.consent,
    })

    if (result.error) {
      setSubmitResult({ error: result.error })
    } else {
      setSubmitResult({
        success: true,
        message: result.message,
      })
      // Redirect to claims page after short delay
      setTimeout(() => {
        router.push('/claims')
      }, 3000)
    }

    setIsSubmitting(false)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Submit Your Claim Experience
        </h1>
        <p className="text-gray-600">
          Share your insurance claim experience to help others understand what to expect.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.key} className="flex items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                  index < currentStepIndex
                    ? 'bg-blue-600 text-white'
                    : index === currentStepIndex
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index < currentStepIndex ? (
                  <Check className="h-4 w-4" />
                ) : (
                  index + 1
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-12 sm:w-24 h-1 mx-2 ${
                    index < currentStepIndex ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {steps.map(step => (
            <span
              key={step.key}
              className="text-xs text-gray-500 w-16 sm:w-24 text-center"
            >
              {step.label}
            </span>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStepIndex].label}</CardTitle>
        </CardHeader>
        <CardContent>
          {submitResult?.success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Submission Complete!
              </h2>
              <p className="text-gray-600 mb-4">{submitResult.message}</p>
              <p className="text-sm text-gray-500">
                Redirecting to claims page...
              </p>
            </div>
          ) : submitResult?.error ? (
            <div className="mb-6">
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {submitResult.error}
              </div>
              <Button
                className="mt-4"
                onClick={() => setSubmitResult(null)}
              >
                Try Again
              </Button>
            </div>
          ) : (
            <>
              {currentStep === 'intro' && (
                <IntroStep
                  consent={formData.consent}
                  onUpdate={(consent) => updateFormData({ consent })}
                  onNext={handleNext}
                />
              )}

              {currentStep === 'metadata' && (
                <MetadataStep
                  metadata={formData.metadata}
                  carriers={carriers}
                  onUpdate={(metadata) => updateFormData({ metadata })}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}

              {currentStep === 'timeline' && (
                <TimelineStep
                  timeline={formData.timeline}
                  outcome={formData.outcome}
                  onUpdateTimeline={(timeline) => updateFormData({ timeline })}
                  onUpdateOutcome={(outcome) => updateFormData({ outcome })}
                  onNext={handleNext}
                  onBack={handleBack}
                />
              )}

              {currentStep === 'review' && (
                <ReviewStep
                  formData={formData}
                  carriers={carriers}
                  isSubmitting={isSubmitting}
                  onSubmit={handleSubmit}
                  onBack={handleBack}
                  onEdit={(step) => setCurrentStep(step)}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
