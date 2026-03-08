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

  async confirm(id: string) {
    const { context, bookingId } = await this.getBookingContext(id);
    try {
      context.confirm();
    } catch (error) {
      // Convertimos cualquier Error a BadRequestException
      throw new BadRequestException(error.message);
    }

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: context.status },
    });
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