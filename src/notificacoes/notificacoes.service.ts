import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NotificacoesService {
  private readonly logger = new Logger(NotificacoesService.name);

  notificar(canal: string, destinatario: string, mensagem: string) {
    this.logger.log(`[stub:${canal}] -> ${destinatario}: ${mensagem}`);
    return { ok: true, canal, destinatario, mensagem };
  }
}
