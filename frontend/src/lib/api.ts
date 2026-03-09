import type { Service, Booking, MentorshipStep } from '@/types'

const API_BASE = 'http://localhost:3000'

export const api = {
  // Services
  async getServices(): Promise<Service[]> {
    const res = await fetch(`${API_BASE}/services`)
    if (!res.ok) throw new Error('Failed to fetch services')
    return res.json()
  },

  async getService(id: string): Promise<Service> {
    const services = await this.getServices()
    const service = services.find((s) => s.id === id)
    if (!service) throw new Error('Service not found')
    return service
  },

  // Bookings
  async createBooking(data: {
    serviceId: string
    clientId: string
    scheduledAt: string
    notes?: string
  }): Promise<Booking> {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Failed to create booking')
    return res.json()
  },

  async getClientBookings(clientId: string): Promise<Booking[]> {
    const res = await fetch(`${API_BASE}/bookings/client/${clientId}`)
    if (!res.ok) throw new Error('Failed to fetch bookings')
    return res.json()
  },

  async confirmBooking(id: string): Promise<Booking> {
    const res = await fetch(`${API_BASE}/bookings/${id}/confirm`, {
      method: 'PATCH',
    })
    if (!res.ok) throw new Error('Failed to confirm booking')
    return res.json()
  },

  async completeBooking(id: string): Promise<Booking> {
    const res = await fetch(`${API_BASE}/bookings/${id}/complete`, {
      method: 'PATCH',
    })
    if (!res.ok) throw new Error('Failed to complete booking')
    return res.json()
  },

  async cancelBooking(id: string): Promise<Booking> {
    const res = await fetch(`${API_BASE}/bookings/${id}/cancel`, {
      method: 'PATCH',
    })
    if (!res.ok) throw new Error('Failed to cancel booking')
    return res.json()
  },

  // Mentorship steps
  async getNextStep(serviceId: string, bookingId: string): Promise<MentorshipStep> {
    const res = await fetch(`${API_BASE}/iterator/${serviceId}/next-step/${bookingId}`)
    if (!res.ok) throw new Error('Failed to fetch next step')
    return res.json()
  },

  async completeStep(serviceId: string, bookingId: string): Promise<MentorshipStep> {
    const res = await fetch(`${API_BASE}/iterator/${serviceId}/complete-step/${bookingId}`)
    if (!res.ok) throw new Error('Failed to complete step')
    return res.json()
  },
}
