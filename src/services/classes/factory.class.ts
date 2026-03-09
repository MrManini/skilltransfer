import { ServiceMode, InteractionType } from '../../../generated/prisma/client.js';

import {
  Service,
  MentoriaService,
  EjecutadoService,
  HibridoService,
  InteractionChannel,
  VideoCallChannel,
  ChatChannel,
  CodingChannel,
  DocumentChannel
} from '../classes/bridge.class.js';

export class ServiceFactory {

  static create(mode: ServiceMode, interactionType: InteractionType): Service {

    let interaction: InteractionChannel;

    // Crear el canal de interacción
    switch (interactionType) {

      case InteractionType.VIDEO_CALL:
        interaction = new VideoCallChannel();
        break;

      case InteractionType.CHAT:
        interaction = new ChatChannel();
        break;

      case InteractionType.LIVE_CODING:
        interaction = new CodingChannel();
        break;

      case InteractionType.NONE:
        interaction = new DocumentChannel();
        break;

      default:
        throw new Error("Tipo de interacción no soportado");
    }

    // Crear el tipo de servicio
    switch (mode) {

      case ServiceMode.MENTORIA:
        return new MentoriaService(interaction);

      case ServiceMode.EJECUTADO:
        return new EjecutadoService(interaction);

      case ServiceMode.HIBRIDO:
        return new HibridoService(interaction);

      default:
        throw new Error("Modo de servicio no soportado");
    }

  }

}