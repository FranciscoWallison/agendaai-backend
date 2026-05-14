import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AgendamentosService } from './agendamentos.service';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { AuthUser } from '../auth/current-user.decorator';

@ApiTags('agendamentos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('agendamentos')
export class AgendamentosController {
  constructor(private readonly service: AgendamentosService) {}

  @Post()
  create(@Body() dto: CreateAgendamentoDto, @CurrentUser() user: AuthUser) {
    return this.service.create(user.id, dto);
  }

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.service.list(user.id);
  }

  @Delete(':id')
  cancel(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.service.cancel(id, user.id);
  }
}
