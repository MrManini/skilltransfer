import { Module } from '@nestjs/common';
import { ServicesController } from './controllers/services.controller.js';
import { BookingController } from './controllers/booking.controller.js';
import { ServicesService } from './services.service.js';
import { BookingService } from './booking.service.js';
import { BookingBridgeController } from './controllers/booking.bridge.controller.js';
import { BookingBridgeService } from './booking.bridge.service.js';
import { BookingBridgeRepository } from './booking.bridge.repository.js';
import { IteratorController } from './controllers/iterator.controller.js';
import { IteratorService } from './iterator.service.js'; 

@Module({
  controllers: [ServicesController, BookingController, BookingBridgeController, IteratorController],
  providers: [ServicesService, BookingService, BookingBridgeService, BookingBridgeRepository, IteratorService],
})
export class ServicesModule {}
