import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserRole, BookingStatus, ServiceMode, InteractionType } from '../generated/prisma/enums.js';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  getHello(): object {
    return { message: 'hola' };
  }

  async getUsers() {
    return this.prisma.user.findMany();
  }

  async createGenericBooking() {
    // 1. Buscar o crear un usuario experto
    let expert = await this.prisma.user.findFirst({
        where: { role: UserRole.EXPERT }
    });
    
    // Si no existe, lo creamos
    if (!expert) {
        expert = await this.prisma.user.create({
            data: {
                name: "Experto Test",
                email: "expertotest@skilltransfer.com",
                password: "password123",
                role: UserRole.EXPERT
            }
        });
    }

    // 2. Buscar o crear un usuario cliente
    let client = await this.prisma.user.findFirst({
        where: { role: UserRole.CLIENT }
    });
    
    // Si no existe, lo creamos
    if (!client) {
        client = await this.prisma.user.create({
            data: {
                name: "Cliente Test",
                email: "clientetest@skilltransfer.com",
                password: "password123",
                role: UserRole.CLIENT
            }
        });
    }

    // 3. Buscar o crear un servicio
    let service = await this.prisma.service.findFirst({
        where: { expertId: expert.id }
    });

    if (!service) {
        service = await this.prisma.service.create({
            data: {
                title: "Mentoria de NestJS",
                description: "Aprende NestJS desde cero hasta experto",
                price: 50.0,
                mode: ServiceMode.MENTORIA,
                interactionType: InteractionType.LIVE_CODING,
                expertId: expert.id
            }
        });
    }

    // 4. Crear la reserva
    const booking = await this.prisma.booking.create({
        data: {
            scheduledAt: new Date(), // Para ahora mismo
            status: BookingStatus.PENDIENTE,
            serviceId: service.id,
            clientId: client.id
        },
        include: {
            service: true,
            client: true
        }
    });

    return booking;
  }
}

