import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Disclaimer } from '@/components/disclaimer'
import { Search, BookOpen, BarChart3, Users, Shield, FileText, TrendingUp, Clock, CheckCircle, AlertTriangle, Star, ChevronRight, HelpCircle } from 'lucide-react'

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Learn from Real Insurance Claim Experiences
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              A crowdsourced, anonymized index of insurance claim experiences.
              Understand how claims unfold, what to expect, and learn from the
              experiences of others.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/claims">
                <Button size="lg" className="w-full sm:w-auto">
                  <Search className="mr-2 h-5 w-5" />
                  Browse Claims
                </Button>
              </Link>
              <Link href="/education">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Learn by Claim Type
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>1. Share Your Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Submit your claim experience anonymously. We automatically
                  remove any personally identifiable information.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>2. Learn from Others</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Browse claim experiences by type, carrier, and outcome.
                  See timelines, processes, and results from real claims.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>3. See the Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  View aggregate data and trends across carriers, claim types,
                  and regions. Make informed decisions with real data.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section - TODO: Connect to real database metrics */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Community Impact
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Real data from real policyholders helping each other navigate the claims process.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900">2,847</div>
              <div className="text-gray-600">Claims Shared</div>
              {/* TODO: Fetch from database */}
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900">1,203</div>
              <div className="text-gray-600">Contributors</div>
              {/* TODO: Fetch from database */}
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900">78%</div>
              <div className="text-gray-600">Approval Rate</div>
              {/* TODO: Calculate from claims data */}
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Clock className="h-8 w-8 text-amber-600" />
              </div>
              <div className="text-4xl font-bold text-gray-900">23 days</div>
              <div className="text-gray-600">Avg. Resolution</div>
              {/* TODO: Calculate from claims data */}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Claims - TODO: Fetch real featured claims */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Recent Claim Experiences
            </h2>
            <Link href="/claims" className="text-blue-600 hover:text-blue-700 flex items-center">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Placeholder Claim 1 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-800 rounded-full">
                    Approved
                  </span>
                  <span className="text-sm text-gray-500">Auto - Collision</span>
                </div>
                <CardTitle className="text-lg">Rear-end collision claim</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  Filed after being rear-ended at a red light. Process took about 3 weeks from start to finish...
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Michigan • State Farm</span>
                  <span className="text-gray-500">21 days</span>
                </div>
              </CardContent>
            </Card>

            {/* Placeholder Claim 2 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                    Partial
                  </span>
                  <span className="text-sm text-gray-500">Home - Water Damage</span>
                </div>
                <CardTitle className="text-lg">Basement flooding claim</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  Sump pump failure led to basement flooding. Initially denied but appealed successfully...
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Michigan • Allstate</span>
                  <span className="text-gray-500">45 days</span>
                </div>
              </CardContent>
            </Card>

            {/* Placeholder Claim 3 */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium px-2 py-1 bg-red-100 text-red-800 rounded-full">
                    Denied
                  </span>
                  <span className="text-sm text-gray-500">Home - Roof</span>
                </div>
                <CardTitle className="text-lg">Storm damage roof claim</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  Denied due to &quot;wear and tear&quot; exclusion. Lesson learned about documenting pre-existing conditions...
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Michigan • Progressive</span>
                  <span className="text-gray-500">14 days</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Carrier Comparison Teaser - TODO: Link to real dashboard */}
      <section className="py-16 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Compare Insurance Carriers
              </h2>
              <p className="text-gray-600 mb-6">
                See how different insurance companies stack up based on real claim experiences from Michigan policyholders.
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span>Approval rates by carrier and claim type</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span>Average resolution times</span>
                </li>
                <li className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-blue-600" />
                  <span>Policyholder satisfaction scores</span>
                </li>
              </ul>
              <Link href="/dashboard">
                <Button>
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Dashboard
                </Button>
              </Link>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-6">
              {/* Placeholder Chart/Table */}
              <h3 className="font-semibold text-gray-900 mb-4">Top Carriers by Approval Rate</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>State Farm</span>
                    <span className="font-medium">84%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-blue-600 rounded-full" style={{ width: '84%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Auto-Owners</span>
                    <span className="font-medium">81%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-blue-600 rounded-full" style={{ width: '81%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Allstate</span>
                    <span className="font-medium">76%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-blue-600 rounded-full" style={{ width: '76%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progressive</span>
                    <span className="font-medium">72%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-blue-600 rounded-full" style={{ width: '72%' }}></div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">Based on 2,847 crowdsourced claims</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What You&apos;ll Find
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Search className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Searchable Claim Index</h3>
                <p className="text-gray-600">
                  Filter claims by state, carrier, policy type, loss type, and outcome.
                  Find experiences similar to your situation.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Data Dashboards</h3>
                <p className="text-gray-600">
                  See aggregate statistics on denial rates, average timelines,
                  and carrier comparisons based on crowdsourced data.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Educational Resources</h3>
                <p className="text-gray-600">
                  Learn about different claim types, the claims process, and
                  what to expect at each stage of your claim.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-amber-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Privacy Protected</h3>
                <p className="text-gray-600">
                  All submissions are automatically sanitized to remove personal
                  information. Your privacy is our priority.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Disclaimer />
        </div>
      </section>

      {/* Testimonials - TODO: Add real user testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            What Policyholders Say
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Hear from community members who used this resource during their claims process.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  &quot;Reading other people&apos;s water damage claims helped me understand what documentation I needed. My claim was approved in just 2 weeks.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium">MK</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Michigan Homeowner</div>
                    <div className="text-sm text-gray-500">Home Insurance Claim</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 2 */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  &quot;After my auto claim was denied, I found similar cases here and learned how to appeal. Got my claim approved on the second try!&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-medium">JR</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Detroit Driver</div>
                    <div className="text-sm text-gray-500">Auto Insurance Claim</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Testimonial 3 */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <Star className="h-4 w-4 text-gray-300" />
                </div>
                <p className="text-gray-600 mb-4">
                  &quot;The carrier comparison data helped me switch to a company with better claim approval rates before renewing my policy.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 font-medium">SL</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Ann Arbor Resident</div>
                    <div className="text-sm text-gray-500">Policy Research</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section - TODO: Expand with more questions */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-center text-gray-600 mb-12">
            Common questions about the Insurance Claim Index
          </p>
          <div className="space-y-6">
            <div className="border-b pb-6">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Is my information kept private?</h3>
                  <p className="text-gray-600">
                    Yes. All submissions are automatically processed to remove personally identifiable information (PII) including names, addresses, phone numbers, and policy numbers before being published.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-b pb-6">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Can I submit a claim experience anonymously?</h3>
                  <p className="text-gray-600">
                    Yes. You can submit your experience without creating an account. However, creating an account allows you to edit your submission, receive updates, and track your contribution history.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-b pb-6">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">How accurate is the carrier comparison data?</h3>
                  <p className="text-gray-600">
                    Our data is crowdsourced from real policyholders. While we verify submissions for authenticity, the statistics reflect user-reported experiences and may not represent every claim outcome.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-b pb-6">
              <div className="flex items-start gap-3">
                <HelpCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Is this legal advice?</h3>
                  <p className="text-gray-600">
                    No. The Insurance Claim Index provides educational information based on crowdsourced experiences. It is not legal, financial, or professional insurance advice. Consult a licensed professional for specific guidance.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-start gap-3">
                <HelpCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Why focus on Michigan?</h3>
                  <p className="text-gray-600">
                    Michigan has unique insurance regulations, including no-fault auto insurance laws. By focusing on one state, we provide more relevant and actionable insights for Michigan residents.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Explore?
          </h2>
          <p className="text-blue-100 max-w-2xl mx-auto mb-8">
            Join thousands of policyholders sharing and learning from insurance
            claim experiences. Your experience could help someone else.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/claims">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Browse Claims
              </Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent text-white border-white hover:bg-blue-700">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
