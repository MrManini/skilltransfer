import { Injectable } from '@nestjs/common';
import { BookingBridgeRepository } from './booking.bridge.repository.js';
import { ServiceFactory } from './classes/factory.class.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class BookingBridgeService {

  constructor(
    private readonly bookingRepository: BookingBridgeRepository,
    private readonly prisma: PrismaService
  ) {}

  async createBooking(data: {
    clientId: string;
    serviceId: string;
    scheduledAt: Date;
  }) {

    const serviceData = await this.prisma.service.findUnique({
      where: { id: data.serviceId }
    });

    if (!serviceData) {
      throw new Error("Service not found");
    }

    const service = ServiceFactory.create(
      serviceData.mode,
      serviceData.interactionType
    );

    const description = service.describe();

    const booking = await this.bookingRepository.createBooking(data);

    return {
      bookingId: booking.id,
      service: description,
      status: booking.status
    };

  }

}