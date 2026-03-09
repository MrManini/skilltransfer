import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const CLIENT_ID = 'client-1'

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date))
}

export function getModeLabel(mode: string): string {
  const labels: Record<string, string> = {
    MENTORIA: 'Mentorship',
    HIBRIDO: 'Hybrid',
    EJECUTADO: 'Service',
  }
  return labels[mode] || mode
}

export function getInteractionLabel(type: string): string {
  const labels: Record<string, string> = {
    VIDEO_CALL: 'Video Call',
    LIVE_CODING: 'Live Coding',
    NONE: 'Async',
  }
  return labels[type] || type
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDIENTE: 'Pending',
    CONFIRMADA: 'Confirmed',
    COMPLETADA: 'Completed',
    CANCELADA: 'Cancelled',
  }
  return labels[status] || status
}
