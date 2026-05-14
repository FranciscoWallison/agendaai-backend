import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { NotificacoesService } from './notificacoes.service';

class TestNotificacaoDto {
  @IsString()
  canal: string;

  @IsString()
  destinatario: string;

  @IsString()
  mensagem: string;
}

@ApiTags('notificacoes')
@Controller('notificacoes')
export class NotificacoesController {
  constructor(private readonly service: NotificacoesService) {}

  @Post('test')
  test(@Body() dto: TestNotificacaoDto) {
    return this.service.notificar(dto.canal, dto.destinatario, dto.mensagem);
  }
}
