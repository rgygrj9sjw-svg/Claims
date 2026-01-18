import { Disclaimer } from '@/components/disclaimer'

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>

      <div className="prose prose-gray max-w-none">
        <p className="text-gray-600 mb-6">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
          <p className="text-gray-600 mb-4">
            We collect information you provide directly to us when you:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mb-4">
            <li>Create an account (email address, optional name)</li>
            <li>Submit a claim experience (claim details, timeline, outcomes)</li>
            <li>Report content or contact us</li>
          </ul>
          <p className="text-gray-600">
            We automatically collect certain information when you use our services,
            including IP address, browser type, and usage data through standard
            web server logs.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
          <p className="text-gray-600 mb-4">We use the information we collect to:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Provide, maintain, and improve our services</li>
            <li>Process and display claim experiences (after anonymization)</li>
            <li>Send you technical notices and support messages</li>
            <li>Respond to your comments and questions</li>
            <li>Detect, investigate, and prevent fraudulent or illegal activities</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Anonymization of Submissions</h2>
          <p className="text-gray-600 mb-4">
            All claim submissions are automatically processed to remove personally
            identifiable information (PII) before being published. This includes:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Email addresses</li>
            <li>Phone numbers</li>
            <li>Physical addresses</li>
            <li>Claim and policy numbers</li>
            <li>Names appearing near identifying keywords</li>
            <li>Social Security numbers</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Information Sharing</h2>
          <p className="text-gray-600 mb-4">
            We do not sell your personal information. We may share anonymized,
            aggregate data about claim experiences publicly on our platform.
          </p>
          <p className="text-gray-600">
            We may share your information with third parties only in the following
            circumstances:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mt-2">
            <li>With your consent</li>
            <li>To comply with legal obligations</li>
            <li>To protect our rights and prevent fraud</li>
            <li>With service providers who assist in operating our platform</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Data Security</h2>
          <p className="text-gray-600">
            We implement appropriate technical and organizational measures to
            protect the security of your personal information. However, no method
            of transmission over the Internet is 100% secure, and we cannot
            guarantee absolute security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">6. Your Rights</h2>
          <p className="text-gray-600 mb-4">You have the right to:</p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your account and associated data</li>
            <li>Object to processing of your personal information</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Contact Us</h2>
          <p className="text-gray-600">
            If you have any questions about this Privacy Policy, please contact
            us through our support channels.
          </p>
        </section>
      </div>

      <div className="mt-12">
        <Disclaimer variant="compact" />
      </div>
    </div>
  )
}
