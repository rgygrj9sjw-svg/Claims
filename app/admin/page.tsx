export const dynamic = 'force-dynamic'

import { getAdminStats } from '@/actions/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { FileText, AlertCircle, Flag, Users } from 'lucide-react'

export default async function AdminDashboardPage() {
  const stats = await getAdminStats()

  const cards = [
    {
      title: 'Total Claims',
      value: stats.totalClaims,
      icon: FileText,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      title: 'Pending Review',
      value: stats.pendingClaims,
      icon: AlertCircle,
      color: 'bg-amber-100 text-amber-600',
      href: '/admin/submissions',
    },
    {
      title: 'Open Reports',
      value: stats.openReports,
      icon: Flag,
      color: 'bg-red-100 text-red-600',
      href: '/admin/reports',
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-green-100 text-green-600',
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card) => {
          const Icon = card.icon
          const content = (
            <Card className={card.href ? 'hover:shadow-md transition-shadow cursor-pointer' : ''}>
              <CardContent className="pt-6">
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${card.color}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">
                      {card.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {card.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )

          if (card.href) {
            return (
              <Link key={card.title} href={card.href}>
                {content}
              </Link>
            )
          }

          return <div key={card.title}>{content}</div>
        })}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/admin/submissions"
                  className="text-blue-600 hover:underline"
                >
                  Review pending submissions ({stats.pendingClaims})
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/reports"
                  className="text-blue-600 hover:underline"
                >
                  Handle open reports ({stats.openReports})
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/education"
                  className="text-blue-600 hover:underline"
                >
                  Manage education articles
                </Link>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Info</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-gray-500">Environment</dt>
                <dd className="font-medium">
                  {process.env.NODE_ENV || 'development'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Database</dt>
                <dd className="font-medium text-green-600">Connected</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
