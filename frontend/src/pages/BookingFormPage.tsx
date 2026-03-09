import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Loader2, ArrowLeft, AlertCircle, CalendarCheck } from 'lucide-react'
import type { Service } from '@/types'
import { api } from '@/lib/api'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import DateTimePicker from '@/components/DateTimePicker'
import { formatPrice, getModeLabel, CLIENT_ID } from '@/lib/utils'
import { toast } from 'sonner'

export default function BookingFormPage() {
  const { serviceId } = useParams<{ serviceId: string }>()
  const navigate = useNavigate()
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [clientId, setClientId] = useState(CLIENT_ID)
  const [scheduledAt, setScheduledAt] = useState<Date | undefined>(undefined)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const fetchService = async () => {
      if (!serviceId) return
      try {
        const data = await api.getService(serviceId)
        setService(data)
      } catch {
        setError('Service not found')
      } finally {
        setLoading(false)
      }
    }
    fetchService()
  }, [serviceId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!serviceId || !scheduledAt) {
      toast.error('Please select a date and time')
      return
    }

    setSubmitting(true)
    try {
      await api.createBooking({
        serviceId,
        clientId,
        scheduledAt: scheduledAt.toISOString(),
        notes: notes || undefined,
      })
      toast.success('Booking created successfully!')
      navigate('/bookings')
    } catch {
      toast.error('Failed to create booking')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center gap-4 text-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div>
          <h2 className="text-lg font-semibold">Service Not Found</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
        <Button asChild variant="outline">
          <Link to="/services">
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button asChild variant="ghost" className="-ml-2">
        <Link to="/services">
          <ArrowLeft className="h-4 w-4" />
          Back to Services
        </Link>
      </Button>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Book Service</h1>
        <p className="text-muted-foreground">
          Complete the form below to schedule your session.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle>{service.title}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </div>
            <Badge>{getModeLabel(service.mode)}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="clientId">Client ID</Label>
              <Input
                id="clientId"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="Enter your client ID"
                required
              />
              <p className="text-xs text-muted-foreground">
                Using default client ID for demo purposes
              </p>
            </div>

            <div className="space-y-2">
              <Label>Schedule Date & Time</Label>
              <DateTimePicker value={scheduledAt} onChange={setScheduledAt} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes or special requests..."
                rows={3}
              />
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t border-border pt-6">
          <div className="text-lg font-bold">{formatPrice(service.price)}</div>
          <Button onClick={handleSubmit} disabled={submitting || !scheduledAt}>
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CalendarCheck className="h-4 w-4" />
            )}
            Confirm Booking
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
