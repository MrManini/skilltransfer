import { Controller, Get, Param } from '@nestjs/common'
import { IteratorService } from '../iterator.service.js'

@Controller('iterator')
export class IteratorController {

  constructor(private servicesService: IteratorService) {}

  @Get(':serviceId/next-step/:clientId')
  async getNextStep(
    @Param('serviceId') serviceId: string,
    @Param('clientId') clientId: string
  ) {
    return this.servicesService.getNextStep(serviceId, clientId)
  }

}