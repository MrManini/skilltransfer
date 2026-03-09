import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service.js'
import { MentorshipPlan } from './classes/aggregate.class.js'

@Injectable()
export class IteratorService {

  constructor(private prisma: PrismaService) {}

  async getNextStep(serviceId: string, bookingId: string) {

    const steps = await this.prisma.mentorshipStep.findMany({
      where: { serviceId },
      orderBy: { order: 'asc' }
    })
  
    if (steps.length === 0) {
      return { message: "No hay pasos para este servicio" }
    }

    const progress = await this.prisma.mentorshipStepProgress.findMany({
      where: { bookingId }
    })

    // If no progress records exist, return the first step
    if (progress.length === 0) {
      return {
        ...steps[0],
        totalSteps: steps.length,
        completedSteps: 0,
        currentStepNumber: 1
      }
    }
  
    const plan = new MentorshipPlan(steps)
    const iterator = plan.createIterator()
    let currentStepNumber = 0
    let completedCount = 0
  
    while(iterator.hasNext()){
      const step = iterator.next()
      if (!step) continue
      
      currentStepNumber++
      const stepProgress = progress.find(p => p.mentorshipStepId === step.id)
      
      if (stepProgress?.completed) {
        completedCount++
      } else {
        // Found the next incomplete step
        return {
          ...step,
          totalSteps: steps.length,
          completedSteps: completedCount,
          currentStepNumber
        }
      }
    }
  
    return { 
      message: "Todos los pasos completados",
      totalSteps: steps.length,
      completedSteps: completedCount
    }
  }

  async completeStep(serviceId: string, bookingId: string) {

    const steps = await this.prisma.mentorshipStep.findMany({
      where: { serviceId },
      orderBy: { order: 'asc' }
    })

    if (steps.length === 0) {
      return { message: "No hay pasos para este servicio" }
    }
  
    let progress = await this.prisma.mentorshipStepProgress.findMany({
      where: { bookingId }
    })

    // If no progress records exist, create them first
    if (progress.length === 0) {
      const booking = await this.prisma.booking.findUnique({
        where: { id: bookingId },
        select: { clientId: true }
      })

      if (!booking) {
        return { message: "Booking no encontrado" }
      }

      const data = steps.map(step => ({
        bookingId: bookingId,
        clientId: booking.clientId,
        mentorshipStepId: step.id,
        completed: false
      }))

      await this.prisma.mentorshipStepProgress.createMany({
        data,
        skipDuplicates: true
      })

      // Refetch progress
      progress = await this.prisma.mentorshipStepProgress.findMany({
        where: { bookingId }
      })
    }
  
    const plan = new MentorshipPlan(steps)
    const iterator = plan.createIterator()
    let completedCount = 0
  
    while(iterator.hasNext()){
      const step = iterator.next()
      if (!step) continue

      const stepProgress = progress.find(p => p.mentorshipStepId === step.id)
  
      if(stepProgress && !stepProgress.completed){
        const updated = await this.prisma.mentorshipStepProgress.update({
          where: { id: stepProgress.id },
          data: { completed: true }
        })

        // Count completed steps
        const allProgress = await this.prisma.mentorshipStepProgress.findMany({
          where: { bookingId }
        })
        completedCount = allProgress.filter(p => p.completed).length
  
        return {
          message: `Paso "${step.title}" completado`,
          step: step,
          progress: updated,
          totalSteps: steps.length,
          completedSteps: completedCount
        }
      }
    }
  
    return { 
      message: "Todos los pasos ya completados",
      totalSteps: steps.length,
      completedSteps: steps.length
    }
  }

}