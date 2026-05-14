import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Agendamento } from './agendamento.entity';
import { Paciente } from '../pacientes/paciente.entity';
import { Profissional } from '../profissionais/profissional.entity';
import { Servico } from '../servicos/servico.entity';
import { AgendamentosService } from './agendamentos.service';
import { AgendamentosController } from './agendamentos.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Agendamento, Paciente, Profissional, Servico]),
  ],
  providers: [AgendamentosService],
  controllers: [AgendamentosController],
  exports: [AgendamentosService],
})
export class AgendamentosModule {}
