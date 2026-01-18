import { EventType } from '@prisma/client'
import { formatDate } from '@/lib/utils'
import {
  FileText,
  Phone,
  Search,
  XCircle,
  DollarSign,
  RefreshCw,
  Scale,
  Gavel,
  Circle,
} from 'lucide-react'

interface TimelineEvent {
  id: string
  date: Date
  eventType: EventType
  notesSanitized: string | null
}

interface ClaimTimelineProps {
  events: TimelineEvent[]
}

const eventTypeConfig: Record<EventType, { label: string; icon: React.ElementType; color: string }> = {
  REPORTED: { label: 'Claim Reported', icon: FileText, color: 'bg-blue-500' },
  FIRST_CONTACT: { label: 'First Contact', icon: Phone, color: 'bg-green-500' },
  INSPECTION: { label: 'Inspection', icon: Search, color: 'bg-purple-500' },
  DENIAL: { label: 'Denial', icon: XCircle, color: 'bg-red-500' },
  PAYMENT: { label: 'Payment', icon: DollarSign, color: 'bg-emerald-500' },
  REOPENED: { label: 'Claim Reopened', icon: RefreshCw, color: 'bg-amber-500' },
  APPRAISAL: { label: 'Appraisal', icon: Scale, color: 'bg-indigo-500' },
  LITIGATION: { label: 'Litigation', icon: Gavel, color: 'bg-rose-500' },
  OTHER: { label: 'Other Event', icon: Circle, color: 'bg-gray-500' },
}

export function ClaimTimeline({ events }: ClaimTimelineProps) {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {sortedEvents.map((event, eventIdx) => {
          const config = eventTypeConfig[event.eventType]
          const Icon = config.icon

          return (
            <li key={event.id}>
              <div className="relative pb-8">
                {eventIdx !== sortedEvents.length - 1 && (
                  <span
                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={`h-8 w-8 rounded-full ${config.color} flex items-center justify-center ring-8 ring-white`}
                    >
                      <Icon className="h-4 w-4 text-white" aria-hidden="true" />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {config.label}
                      </p>
                      {event.notesSanitized && (
                        <p className="mt-1 text-sm text-gray-600">
                          {event.notesSanitized}
                        </p>
                      )}
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      {formatDate(new Date(event.date))}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function ClaimTimelineSkeleton() {
  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {[1, 2, 3].map((i) => (
          <li key={i}>
            <div className="relative pb-8">
              {i !== 3 && (
                <span
                  className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                  aria-hidden="true"
                />
              )}
              <div className="relative flex space-x-3">
                <div>
                  <span className="h-8 w-8 rounded-full bg-gray-200 animate-pulse flex items-center justify-center ring-8 ring-white" />
                </div>
                <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-48 bg-gray-100 rounded animate-pulse" />
                  </div>
                  <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
