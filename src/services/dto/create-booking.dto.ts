import { ApiProperty } from '@nestjs/swagger';
import { ServiceMode, InteractionType } from '../../../generated/prisma/client.js';

export class CreateBookingDto {

  @ApiProperty()
  clientId: string;

  @ApiProperty()
  serviceId: string;

  @ApiProperty()
  scheduledAt: string;

}