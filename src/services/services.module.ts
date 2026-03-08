import { Module } from '@nestjs/common';
import { ServicesController } from './controllers/services.controller.js';
import { ServicesService } from './services.service.js';

@Module({
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
