import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

export interface CreateBookingDTO {
  clientId: string;
  serviceId: string;
  scheduledAt: Date;
}

@Injectable()
export class BookingBridgeRepository {

  constructor(private readonly prisma: PrismaService) {}

  async createBooking(data: CreateBookingDTO) {

    return this.prisma.booking.create({
      data: {
        clientId: data.clientId,
        serviceId: data.serviceId,
        scheduledAt: data.scheduledAt
      },
      include: {
        service: true
      }
    });

  }

}