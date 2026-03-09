export interface Service {
  id: string
  title: string
  description: string
  price: number
  mode: 'MENTORIA' | 'HIBRIDO' | 'EJECUTADO'
  interactionType: 'VIDEO_CALL' | 'LIVE_CODING' | 'NONE'
  expertId: string
}

export interface Booking {
  id: string
  serviceId: string
  clientId: string
  scheduledAt: string
  notes?: string
  status: 'PENDIENTE' | 'CONFIRMADA' | 'COMPLETADA' | 'CANCELADA'
  service: Service
}

export interface MentorshipStep {
  id: string
  order: number
  title: string
  serviceId: string
  totalSteps?: number
  completedSteps?: number
  currentStepNumber?: number
  message?: string
}
