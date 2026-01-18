'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Trash2 } from 'lucide-react'
import type { TimelineEventInput, ClaimOutcomeInput } from '@/lib/validators'

interface TimelineStepProps {
  timeline: TimelineEventInput[]
  outcome: Partial<ClaimOutcomeInput>
  onUpdateTimeline: (timeline: TimelineEventInput[]) => void
  onUpdateOutcome: (outcome: Partial<ClaimOutcomeInput>) => void
  onNext: () => void
  onBack: () => void
}

const eventTypes = [
  { value: 'REPORTED', label: 'Claim Reported' },
  { value: 'FIRST_CONTACT', label: 'First Contact from Carrier' },
  { value: 'INSPECTION', label: 'Inspection/Assessment' },
  { value: 'DENIAL', label: 'Denial Received' },
  { value: 'PAYMENT', label: 'Payment Received' },
  { value: 'REOPENED', label: 'Claim Reopened' },
  { value: 'APPRAISAL', label: 'Appraisal Invoked' },
  { value: 'LITIGATION', label: 'Litigation Started' },
  { value: 'OTHER', label: 'Other Event' },
]

export function TimelineStep({
  timeline,
  outcome,
  onUpdateTimeline,
  onUpdateOutcome,
  onNext,
  onBack,
}: TimelineStepProps) {
  const [newEvent, setNewEvent] = useState<Partial<TimelineEventInput>>({
    date: '',
    eventType: undefined,
    notes: '',
  })

  const addEvent = () => {
    if (newEvent.date && newEvent.eventType) {
      onUpdateTimeline([
        ...timeline,
        {
          date: newEvent.date,
          eventType: newEvent.eventType,
          notes: newEvent.notes,
        },
      ])
      setNewEvent({ date: '', eventType: undefined, notes: '' })
    }
  }

  const removeEvent = (index: number) => {
    onUpdateTimeline(timeline.filter((_, i) => i !== index))
  }

  const isValid = timeline.length > 0

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-gray-900 mb-2">Claim Timeline</h3>
        <p className="text-sm text-gray-600">
          Add key events from your claim. Include at least one event (e.g., when
          you first reported the claim).
        </p>
      </div>

      {/* Existing events */}
      {timeline.length > 0 && (
        <div className="space-y-3">
          {timeline.map((event, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-900">
                        {eventTypes.find(t => t.value === event.eventType)?.label}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(event.date).toLocaleDateString()}
                      </span>
                    </div>
                    {event.notes && (
                      <p className="text-sm text-gray-600 mt-1">{event.notes}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEvent(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add new event */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <h4 className="font-medium text-gray-900">Add Event</h4>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="eventDate">Date</Label>
              <Input
                id="eventDate"
                type="date"
                value={newEvent.date || ''}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, date: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="eventType">Event Type</Label>
              <Select
                id="eventType"
                value={newEvent.eventType || ''}
                onChange={(e) =>
                  setNewEvent({
                    ...newEvent,
                    eventType: e.target.value as TimelineEventInput['eventType'],
                  })
                }
              >
                <option value="">Select event type</option>
                {eventTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="eventNotes">
              Notes (Optional - Personal info will be automatically removed)
            </Label>
            <Textarea
              id="eventNotes"
              value={newEvent.notes || ''}
              onChange={(e) =>
                setNewEvent({ ...newEvent, notes: e.target.value })
              }
              placeholder="Describe what happened..."
              rows={3}
            />
          </div>

          <Button
            onClick={addEvent}
            disabled={!newEvent.date || !newEvent.eventType}
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </CardContent>
      </Card>

      {/* Outcome */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">Claim Outcome</h3>

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="initialPayment">Initial Payment Amount (Optional)</Label>
            <Input
              id="initialPayment"
              type="number"
              min="0"
              placeholder="0"
              value={outcome.initialPaymentAmount || ''}
              onChange={(e) =>
                onUpdateOutcome({
                  ...outcome,
                  initialPaymentAmount: e.target.value
                    ? parseFloat(e.target.value)
                    : undefined,
                })
              }
            />
          </div>

          <div>
            <Label htmlFor="finalPayment">Final Payment Amount (Optional)</Label>
            <Input
              id="finalPayment"
              type="number"
              min="0"
              placeholder="0"
              value={outcome.finalPaymentAmount || ''}
              onChange={(e) =>
                onUpdateOutcome({
                  ...outcome,
                  finalPaymentAmount: e.target.value
                    ? parseFloat(e.target.value)
                    : undefined,
                })
              }
            />
          </div>
        </div>

        <div className="space-y-3">
          <Checkbox
            checked={outcome.deniedFlag || false}
            onChange={(e) =>
              onUpdateOutcome({ ...outcome, deniedFlag: e.target.checked })
            }
            label="Claim was denied (fully or initially)"
          />

          <Checkbox
            checked={outcome.partialFlag || false}
            onChange={(e) =>
              onUpdateOutcome({ ...outcome, partialFlag: e.target.checked })
            }
            label="Received partial payment (less than claimed)"
          />

          <Checkbox
            checked={outcome.appraisalFlag || false}
            onChange={(e) =>
              onUpdateOutcome({ ...outcome, appraisalFlag: e.target.checked })
            }
            label="Appraisal process was invoked"
          />

          <Checkbox
            checked={outcome.litigationFlag || false}
            onChange={(e) =>
              onUpdateOutcome({ ...outcome, litigationFlag: e.target.checked })
            }
            label="Litigation/lawsuit was involved"
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!isValid}>
          Continue to Review
        </Button>
      </div>
    </div>
  )
}
