import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('saludo')
  getHello(): object {
    return this.appService.getHello();
  }

  @Get('usuarios')
  async getUsers() {
    return this.appService.getUsers();
  }

  @Post('bookings/create-demo')
  async createGenericBooking() {
    return this.appService.createGenericBooking();
  }
}

