import { Controller, Patch, Param, Get } from '@nestjs/common';
import { BookingService } from '../booking.service.js';

@Controller('bookings')
export class BookingController {

  constructor(private readonly bookingService: BookingService) {}


  @Patch(':id/confirm')
  confirm(@Param('id') id: string) {
    return this.bookingService.confirm(id);
  }

  @Patch(':id/complete')
  complete(@Param('id') id: string) {
    return this.bookingService.complete(id);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.bookingService.cancel(id);
  }

}