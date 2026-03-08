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
  
    const progress = await this.prisma.mentorshipStepProgress.findMany({
      where: { bookingId }
    })
  
    const plan = new MentorshipPlan(steps)
    const iterator = plan.createIterator()
  
    while(iterator.hasNext()){
  
      const step = iterator.next()

      if (!step) continue

      const stepProgress = progress.find(
        p => p.mentorshipStepId === step.id
      )
  
      if(stepProgress && !stepProgress.completed){
        return step
      }
  
    }
  
    return { message: "Todos los pasos completados" }
  }

  async completeStep(serviceId: string, bookingId: string) {

    const steps = await this.prisma.mentorshipStep.findMany({
      where: { serviceId },
      orderBy: { order: 'asc' }
    })
  
    const progress = await this.prisma.mentorshipStepProgress.findMany({
      where: { bookingId }
    })
  
    const plan = new MentorshipPlan(steps)
    const iterator = plan.createIterator()
  
    while(iterator.hasNext()){
  
      const step = iterator.next()

      if (!step) continue

      const stepProgress = progress.find(
        p => p.mentorshipStepId === step.id
      )
  
      if(stepProgress && !stepProgress.completed){
  
        const updated = await this.prisma.mentorshipStepProgress.update({
          where: { id: stepProgress.id },
          data: { completed: true }
        })
  
        return {
          message: "Paso completado",
          step: step,
          progress: updated
        }
  
      }
  
    }
  
    return { message: "Todos los pasos ya completados" }
  }

}