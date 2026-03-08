import { Controller, Get } from '@nestjs/common';
import { ServicesService } from '../services.service.js';
import { ServiceCalculator } from '../classes/service-calculator.class.js';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get()
  findAll() {
    return this.servicesService.findAll();
  }

  @Get('summary')
  async getSummary() {
    const services = await this.servicesService.findAll();
    const calculator = new ServiceCalculator(services);
    return calculator.getSummary();
  }
}
