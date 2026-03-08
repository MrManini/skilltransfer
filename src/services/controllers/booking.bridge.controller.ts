import { Controller, Post, Body } from '@nestjs/common';
import { BookingBridgeService } from '../booking.bridge.service.js';
import { CreateBookingDto } from '../dto/create-booking.dto.js';

@Controller('bookings')
export class BookingBridgeController {

  constructor(private readonly bookingService: BookingBridgeService) {}

  @Post()
  createBooking(@Body() body: CreateBookingDto) {

    return this.bookingService.createBooking({
      clientId: body.clientId,
      serviceId: body.serviceId,
      scheduledAt: new Date(body.scheduledAt)
    });

  }

}