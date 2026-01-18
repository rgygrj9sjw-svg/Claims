import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Disclaimer } from '@/components/disclaimer'
import { Card, CardContent } from '@/components/ui/card'
import { Shield, Users, BarChart3, BookOpen } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">About Insurance Claim Index</h1>

      <div className="prose prose-gray max-w-none mb-12">
        <p className="text-lg text-gray-600 mb-6">
          Insurance Claim Index is a crowdsourced platform where policyholders
          share their insurance claim experiences to help others understand what
          to expect during the claims process.
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Mission</h2>
          <p className="text-gray-600">
            We believe that transparency in the insurance claims process benefits
            everyone. By collecting and sharing anonymized claim experiences, we
            aim to empower policyholders with knowledge about what others have
            experienced, educational resources about different claim types, and
            aggregate data showing patterns and trends.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">What We Are</h2>
          <p className="text-gray-600">
            Insurance Claim Index is an educational resource that aggregates
            crowdsourced claim experiences. We provide a platform for
            policyholders to share their stories in an anonymized format, helping
            others learn from real-world experiences.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">What We Are NOT</h2>
          <p className="text-gray-600 mb-4">
            It is equally important to understand what Insurance Claim Index is
            not:
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>We are NOT legal advisors or attorneys</li>
            <li>We are NOT insurance professionals or adjusters</li>
            <li>We are NOT affiliated with any insurance company</li>
            <li>We do NOT provide advice for specific claims</li>
            <li>We do NOT verify the accuracy of submissions</li>
            <li>We do NOT guarantee any particular outcome</li>
          </ul>
        </section>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Privacy First</h3>
                <p className="text-sm text-gray-600">
                  All submissions are automatically anonymized. We remove personal
                  information like names, addresses, and policy numbers before
                  publishing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Community Driven</h3>
                <p className="text-sm text-gray-600">
                  Our data comes from real policyholders sharing their experiences.
                  Every submission helps build a more complete picture.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <BarChart3 className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Data Insights</h3>
                <p className="text-sm text-gray-600">
                  View aggregate statistics and trends across carriers, claim
                  types, and regions to understand broader patterns.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Educational Resources</h3>
                <p className="text-sm text-gray-600">
                  Our education library provides general information about different
                  types of claims and the claims process.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA */}
      <div className="bg-gray-100 rounded-lg p-8 text-center mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Ready to Contribute?
        </h2>
        <p className="text-gray-600 mb-6">
          Your experience could help thousands of others understand what to expect
          during their own claims process.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/claims">
            <Button variant="outline">Browse Claims</Button>
          </Link>
          <Link href="/register">
            <Button>Create Account</Button>
          </Link>
        </div>
      </div>

      <Disclaimer />
    </div>
  )
}
