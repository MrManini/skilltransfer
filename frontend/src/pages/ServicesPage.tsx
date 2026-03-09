import { useState, useEffect } from 'react'
import { Loader2, AlertCircle, Sparkles } from 'lucide-react'
import type { Service } from '@/types'
import { api } from '@/lib/api'
import ServiceCard from '@/components/ServiceCard'

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await api.getServices()
        setServices(data)
      } catch {
        setError('Failed to load services. Make sure the backend is running on localhost:3000')
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

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

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Available Services</h1>
        </div>
        <p className="text-muted-foreground">
          Browse our expert services and mentorship programs. Book a session to start learning or get things done.
        </p>
      </div>

      {services.length === 0 ? (
        <div className="flex min-h-75 flex-col items-center justify-center rounded-lg border border-dashed border-border p-8 text-center">
          <p className="text-muted-foreground">No services available at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  )
}
