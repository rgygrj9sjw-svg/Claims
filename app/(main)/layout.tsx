import { NavHeader } from '@/components/nav-header'
import { Disclaimer } from '@/components/disclaimer'
import { DisclaimerFooter } from '@/components/disclaimer'
import Link from 'next/link'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Disclaimer variant="banner" />
      <NavHeader />
      <main className="flex-1">{children}</main>
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Platform</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/claims" className="hover:text-gray-900">Browse Claims</Link></li>
                <li><Link href="/dashboards" className="hover:text-gray-900">Dashboards</Link></li>
                <li><Link href="/submit" className="hover:text-gray-900">Submit a Claim</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Learn</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/education" className="hover:text-gray-900">Education Library</Link></li>
                <li><Link href="/about" className="hover:text-gray-900">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/privacy" className="hover:text-gray-900">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-gray-900">Terms of Use</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Account</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link href="/login" className="hover:text-gray-900">Sign In</Link></li>
                <li><Link href="/register" className="hover:text-gray-900">Create Account</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <DisclaimerFooter />
      </footer>
    </div>
  )
}
