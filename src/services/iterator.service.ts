import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service.js'
import { MentorshipPlan } from './classes/aggregate.class.js'

@Injectable()
export class IteratorService {

  constructor(private prisma: PrismaService) {}

  async getNextStep(serviceId: string, clientId: string) {

    const steps = await this.prisma.mentorshipStep.findMany({
      where: { serviceId },
      orderBy: { order: 'asc' }
    })

    const progress = await this.prisma.mentorshipStepProgress.findMany({
      where: { clientId }
    })

    const completedIds = progress.map(p => p.mentorshipStepId)

    const plan = new MentorshipPlan(steps)
    const iterator = plan.createIterator()

    while(iterator.hasNext()){

      const step = iterator.next()

      if(step && !completedIds.includes(step.id)){
        return step
      }

    }

    return null
  }

}