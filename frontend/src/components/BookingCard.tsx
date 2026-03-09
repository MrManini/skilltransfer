import { useState } from 'react'
import { Check, X, Play, Loader2 } from 'lucide-react'
import type { Booking } from '@/types'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api'
import { formatDate, getModeLabel, getStatusLabel } from '@/lib/utils'
import { toast } from 'sonner'
import MentorshipSteps from './MentorshipSteps'

interface BookingCardProps {
  booking: Booking
  onUpdate: () => void
}

export default function BookingCard({ booking, onUpdate }: BookingCardProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [showSteps, setShowSteps] = useState(false)

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'PENDIENTE':
        return 'warning'
      case 'CONFIRMADA':
        return 'default'
      case 'COMPLETADA':
        return 'success'
      case 'CANCELADA':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  const handleAction = async (action: 'confirm' | 'complete' | 'cancel') => {
    setLoading(action)
    try {
      switch (action) {
        case 'confirm':
          await api.confirmBooking(booking.id)
          toast.success('Booking confirmed!')
          break
        case 'complete':
          await api.completeBooking(booking.id)
          toast.success('Booking completed!')
          break
        case 'cancel':
          await api.cancelBooking(booking.id)
          toast.info('Booking cancelled')
          break
      }
      onUpdate()
    } catch {
      toast.error(`Failed to ${action} booking`)
    } finally {
      setLoading(null)
    }
  }

  const isMentorship = booking.service.mode === 'MENTORIA'
  const canConfirm = booking.status === 'PENDIENTE'
  const canComplete = booking.status === 'CONFIRMADA'
  const canCancel = booking.status !== 'COMPLETADA' && booking.status !== 'CANCELADA'
  const canStartSteps = booking.status === 'CONFIRMADA' && isMentorship

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-lg">{booking.service.title}</CardTitle>
            <CardDescription>{formatDate(booking.scheduledAt)}</CardDescription>
          </div>
          <Badge variant={getStatusVariant(booking.status)}>{getStatusLabel(booking.status)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Badge variant="outline">{getModeLabel(booking.service.mode)}</Badge>
        </div>
        {booking.notes && (
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Notes:</span> {booking.notes}
          </p>
        )}
        {showSteps && canStartSteps && (
          <MentorshipSteps 
            serviceId={booking.serviceId} 
            bookingId={booking.id}
            onComplete={() => {
              setShowSteps(false)
              handleAction('complete')
            }}
          />
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 border-t border-border pt-4">
        {canConfirm && (
          <Button
            size="sm"
            onClick={() => handleAction('confirm')}
            disabled={loading !== null}
          >
            {loading === 'confirm' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Confirm
          </Button>
        )}
        {canStartSteps && !showSteps && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setShowSteps(true)}
          >
            <Play className="h-4 w-4" />
            Start Learning
          </Button>
        )}
        {canComplete && !isMentorship && (
          <Button
            size="sm"
            variant="success"
            onClick={() => handleAction('complete')}
            disabled={loading !== null}
          >
            {loading === 'complete' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-4 w-4" />
            )}
            Complete
          </Button>
        )}
        {canCancel && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleAction('cancel')}
            disabled={loading !== null}
          >
            {loading === 'cancel' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
            Cancel
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
