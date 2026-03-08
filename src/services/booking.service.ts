import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service.js';
import { BookingContext } from './classes/bookingstatus.class.js';


@Injectable()
export class BookingService {

  constructor(private readonly prisma: PrismaService) {}

  private async getBookingContext(id: string): Promise<{ context: BookingContext, bookingId: string }> {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException(`Booking con id ${id} no encontrado`);
    const context = new BookingContext(booking.status);
    return { context, bookingId: booking.id };
  }

  async initializeMentorshipProgress(bookingId: string, serviceId: string, clientId: string) {

    const steps = await this.prisma.mentorshipStep.findMany({
      where: { serviceId }
    })
  
    const data = steps.map(step => ({
      bookingId: bookingId,
      clientId: clientId, // 👈 agregar
      mentorshipStepId: step.id,
      completed: false
    }))
  
    return this.prisma.mentorshipStepProgress.createMany({
      data,
      skipDuplicates: true
    })
  }

  async confirm(id: string) {

    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { service: true }
    })
  
    if (!booking) {
      throw new NotFoundException(`Booking ${id} no encontrado`)
    }
  
    const { context, bookingId } = await this.getBookingContext(id)
  
    try {
      context.confirm()
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  
    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: context.status }
    })
  
    // SOLO SI NO ES EJECUTADO
    if (booking.service.mode !== "EJECUTADO") {
  
      await this.initializeMentorshipProgress(
        bookingId,
        booking.serviceId,
        booking.clientId
      )
  
    }
  
    return updatedBooking
  }

  async complete(id: string) {
    const { context, bookingId } = await this.getBookingContext(id);
    try {
      context.complete();
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: context.status },
    });
  }

  async cancel(id: string) {
    const { context, bookingId } = await this.getBookingContext(id);
    try {
      context.cancel();
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: context.status },
    });
  }
}