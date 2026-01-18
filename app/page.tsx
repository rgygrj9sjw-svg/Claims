import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Disclaimer } from '@/components/disclaimer'
import { Search, BookOpen, BarChart3, Users, Shield, FileText } from 'lucide-react'

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
