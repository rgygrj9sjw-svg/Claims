import { AlertTriangle } from 'lucide-react'

interface DisclaimerProps {
  variant?: 'default' | 'compact' | 'banner'
  className?: string
}

export function Disclaimer({ variant = 'default', className = '' }: DisclaimerProps) {
  if (variant === 'banner') {
    return (
      <div className={`bg-amber-50 border-b border-amber-200 px-4 py-2 ${className}`}>
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-amber-800">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span>
            <strong>Important:</strong> This site provides general information only, not legal or professional advice.
          </span>
        </div>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={`bg-gray-50 border border-gray-200 rounded-lg p-3 ${className}`}>
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5 text-amber-500" />
          <p>
            The information shared is from individual experiences and should not be considered legal,
            financial, or professional advice.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-amber-50 border border-amber-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5 text-amber-500" />
        <div className="text-sm text-amber-800">
          <p className="font-semibold mb-2">Important Disclaimer</p>
          <ul className="space-y-1 list-disc list-inside">
            <li>This site shares anonymized, crowdsourced insurance claim experiences for educational purposes only.</li>
            <li>The information provided is not legal, financial, or professional advice.</li>
            <li>Each insurance claim is unique. Your specific situation may differ significantly from experiences shared here.</li>
            <li>Always consult with qualified professionals (attorneys, public adjusters, insurance experts) for advice on your specific claim.</li>
            <li>We do not endorse or recommend any specific actions based on the information provided.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export function DisclaimerFooter() {
  return (
    <div className="text-xs text-gray-500 text-center py-4 border-t border-gray-200">
      <p>
        Insurance Claim Index provides general information only. This is not legal advice.
        <br />
        Consult qualified professionals for advice on your specific situation.
      </p>
    </div>
  )
}
