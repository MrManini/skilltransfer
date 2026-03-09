import { Controller, Get, Post, Param } from '@nestjs/common'
import { IteratorService } from '../iterator.service.js'

@Controller('iterator')
export class IteratorController {

  constructor(private servicesService: IteratorService) {}

  @Get(':serviceId/next-step/:bookingId')
getNextStep(
  @Param('serviceId') serviceId: string,
  @Param('bookingId') bookingId: string
){
  return this.servicesService.getNextStep(serviceId, bookingId)
}

  @Post(':serviceId/complete-step/:bookingId')
  completeStep(
    @Param('serviceId') serviceId: string,
    @Param('bookingId') bookingId: string
  ){
    return this.servicesService.completeStep(serviceId, bookingId)
  }

}