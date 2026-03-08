import { ServiceMode, InteractionType} from '../../../generated/prisma/client.js';

// INTERACTION IMPLEMENTOR (Bridge)
export interface InteractionChannel {
  getType(): InteractionType;
}

export class VideoCallChannel implements InteractionChannel {
  getType(): InteractionType {
    return InteractionType.VIDEO_CALL;
  }
}

export class ChatChannel implements InteractionChannel {
  getType(): InteractionType {
    return InteractionType.CHAT;
  }
}

export class CodingChannel implements InteractionChannel {
  getType(): InteractionType {
    return InteractionType.LIVE_CODING;
  }
}

export class DocumentChannel implements InteractionChannel {
  getType(): InteractionType {
    return InteractionType.NONE;
  }
}

// ABSTRACTION (Bridge)
export abstract class Service {
  protected interaction: InteractionChannel;
  protected mode: ServiceMode;

  constructor(mode: ServiceMode, interaction: InteractionChannel) {
    this.mode = mode;
    this.interaction = interaction;
  }

  abstract describe(): string;
}

// REFINED ABSTRACTIONS

export class MentoriaService extends Service {

  constructor(interaction: InteractionChannel) {
    super(ServiceMode.MENTORIA, interaction);
  }

  describe(): string {
    return `${this.mode} vía ${this.interaction.getType()}`;
  }

}

export class EjecutadoService extends Service {

  constructor(interaction: InteractionChannel) {
    super(ServiceMode.EJECUTADO, interaction);
  }

  describe(): string {
    return `${this.mode} entregado por ${this.interaction.getType()}`;
  }

}

export class HibridoService extends Service {

  constructor(interaction: InteractionChannel) {
    super(ServiceMode.HIBRIDO, interaction);
  }

  describe(): string {
    return `${this.mode} mediante ${this.interaction.getType()}`;
  }

}