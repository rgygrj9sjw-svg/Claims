'use client'

import { Disclaimer } from '@/components/disclaimer'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import type { ConsentData } from '@/types'

interface IntroStepProps {
  consent: ConsentData
  onUpdate: (consent: ConsentData) => void
  onNext: () => void
}

export function IntroStep({ consent, onUpdate, onNext }: IntroStepProps) {
  const allConsented =
    consent.accuracyConfirmed &&
    consent.noLegalAdvice &&
    consent.termsAccepted

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">
          Before You Begin
        </h3>
        <p className="text-gray-600 text-sm">
          Thank you for considering sharing your claim experience. Your
          submission will help others understand what to expect during the
          insurance claims process.
        </p>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-2">What We Collect</h4>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li>General claim information (type, carrier, state, dates)</li>
          <li>Timeline of events during your claim</li>
          <li>Outcome information (payment amounts, resolution)</li>
          <li>Any notes about your experience (automatically sanitized)</li>
        </ul>
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-2">Privacy Protection</h4>
        <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
          <li>All submissions are anonymized - your identity is never revealed</li>
          <li>Personal information (names, addresses, phone numbers) is automatically removed</li>
          <li>Claim/policy numbers are redacted</li>
          <li>Content is reviewed for inappropriate or defamatory language</li>
        </ul>
      </div>

      <Disclaimer />

      <div className="border-t border-gray-200 pt-6 space-y-4">
        <h4 className="font-medium text-gray-900">Please confirm the following:</h4>

        <div className="space-y-3">
          <Checkbox
            checked={consent.accuracyConfirmed}
            onChange={(e) =>
              onUpdate({ ...consent, accuracyConfirmed: e.target.checked })
            }
            label="I confirm that the information I'm providing is accurate to the best of my knowledge"
          />

          <Checkbox
            checked={consent.noLegalAdvice}
            onChange={(e) =>
              onUpdate({ ...consent, noLegalAdvice: e.target.checked })
            }
            label="I understand this platform provides general information only and is not a substitute for professional legal, financial, or insurance advice"
          />

          <Checkbox
            checked={consent.termsAccepted}
            onChange={(e) =>
              onUpdate({ ...consent, termsAccepted: e.target.checked })
            }
            label="I agree to the Terms of Use and Privacy Policy, and consent to my anonymized experience being shared publicly"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!allConsented}>
          Continue
        </Button>
      </div>
    </div>
  )
}
