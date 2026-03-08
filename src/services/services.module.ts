import { Module } from '@nestjs/common';
import { ServicesController } from './controllers/services.controller.js';
import { BookingController } from './controllers/booking.controller.js';
import { ServicesService } from './services.service.js';
import { BookingService } from './booking.service.js';

@Module({
  controllers: [ServicesController, BookingController],
  providers: [ServicesService, BookingService],
})
export class ServicesModule {}
