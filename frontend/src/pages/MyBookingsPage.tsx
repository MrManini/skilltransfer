import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, AlertCircle, Calendar, Plus } from 'lucide-react'
import type { Booking } from '@/types'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import BookingCard from '@/components/BookingCard'
import { CLIENT_ID } from '@/lib/utils'

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBookings = useCallback(async () => {
    try {
      const data = await api.getClientBookings(CLIENT_ID)
      setBookings(data)
      setError(null)
    } catch {
      setError('Failed to load bookings. Make sure the backend is running on localhost:3000')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center gap-4 text-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <div>
          <h2 className="text-lg font-semibold">Connection Error</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  const pendingBookings = bookings.filter((b) => b.status === 'PENDIENTE')
  const confirmedBookings = bookings.filter((b) => b.status === 'CONFIRMADA')
  const completedBookings = bookings.filter((b) => b.status === 'COMPLETADA')
  const cancelledBookings = bookings.filter((b) => b.status === 'CANCELADA')

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your appointments and track your progress.
          </p>
        </div>
        <Button asChild>
          <Link to="/services">
            <Plus className="h-4 w-4" />
            Book New
          </Link>
        </Button>
      </div>

      {bookings.length === 0 ? (
        <div className="flex min-h-75 flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border p-8 text-center">
          <Calendar className="h-12 w-12 text-muted-foreground/50" />
          <div>
            <p className="font-medium">No bookings yet</p>
            <p className="text-sm text-muted-foreground">
              Browse our services and book your first session.
            </p>
          </div>
          <Button asChild>
            <Link to="/services">Browse Services</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {pendingBookings.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Pending Confirmation</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {pendingBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} onUpdate={fetchBookings} />
                ))}
              </div>
            </section>
          )}

          {confirmedBookings.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Confirmed</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {confirmedBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} onUpdate={fetchBookings} />
                ))}
              </div>
            </section>
          )}

          {completedBookings.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">Completed</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {completedBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} onUpdate={fetchBookings} />
                ))}
              </div>
            </section>
          )}

          {cancelledBookings.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-muted-foreground">Cancelled</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {cancelledBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} onUpdate={fetchBookings} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}
