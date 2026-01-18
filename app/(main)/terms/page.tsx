import { Disclaimer } from '@/components/disclaimer'

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Use</h1>

      <div className="prose prose-gray max-w-none">
        <p className="text-gray-600 mb-6">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
          <p className="text-gray-600">
            By accessing or using Insurance Claim Index, you agree to be bound by
            these Terms of Use. If you do not agree to these terms, please do not
            use our services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
          <p className="text-gray-600">
            Insurance Claim Index is a platform for sharing anonymized insurance
            claim experiences for educational purposes. We provide a crowdsourced
            index of claim experiences, educational resources about insurance
            claims, and aggregate data and statistics.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Important Disclaimers</h2>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <p className="text-amber-800 font-semibold mb-2">
              THIS PLATFORM DOES NOT PROVIDE LEGAL, FINANCIAL, OR PROFESSIONAL ADVICE.
            </p>
            <p className="text-amber-700 text-sm">
              The information on this site is for general educational purposes only.
              Every insurance claim is unique, and the experiences shared here may
              not apply to your specific situation. Always consult with qualified
              professionals for advice on your specific claim.
            </p>
          </div>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>We do not verify the accuracy of user submissions</li>
            <li>We are not affiliated with any insurance company</li>
            <li>We do not recommend any specific course of action</li>
            <li>Past experiences do not predict future outcomes</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">4. User Submissions</h2>
          <p className="text-gray-600 mb-4">When you submit content to our platform, you:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Confirm that the information is accurate to the best of your knowledge</li>
            <li>Grant us a non-exclusive license to use, display, and distribute your anonymized submission</li>
            <li>Agree not to submit false, misleading, or defamatory content</li>
            <li>Agree not to include personally identifiable information of others</li>
            <li>Understand that submissions may be moderated and edited for clarity</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Prohibited Conduct</h2>
          <p className="text-gray-600 mb-4">You agree not to:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Submit false or misleading information</li>
            <li>Post defamatory, threatening, or harassing content</li>
            <li>Impersonate others or misrepresent your identity</li>
            <li>Use the platform for commercial solicitation</li>
            <li>Attempt to circumvent security measures</li>
            <li>Scrape or harvest data from the platform</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Intellectual Property</h2>
          <p className="text-gray-600">
            The platform, including its design, features, and content (excluding
            user submissions), is owned by Insurance Claim Index. User submissions
            remain the property of their respective authors, with a license granted
            to us as described above.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Limitation of Liability</h2>
          <p className="text-gray-600">
            TO THE MAXIMUM EXTENT PERMITTED BY LAW, INSURANCE CLAIM INDEX AND ITS
            AFFILIATES SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
            CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE PLATFORM
            OR RELIANCE ON ANY INFORMATION PROVIDED.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Indemnification</h2>
          <p className="text-gray-600">
            You agree to indemnify and hold harmless Insurance Claim Index from
            any claims, damages, or expenses arising from your use of the platform,
            your submissions, or your violation of these terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Modifications</h2>
          <p className="text-gray-600">
            We may modify these Terms of Use at any time. Continued use of the
            platform after changes constitutes acceptance of the modified terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Contact</h2>
          <p className="text-gray-600">
            For questions about these Terms of Use, please contact us through our
            support channels.
          </p>
        </section>
      </div>

      <div className="mt-12">
        <Disclaimer variant="compact" />
      </div>
    </div>
  )
}
