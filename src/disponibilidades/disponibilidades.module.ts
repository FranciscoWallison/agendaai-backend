import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Disponibilidade } from './disponibilidade.entity';
import { Servico } from '../servicos/servico.entity';
import { Agendamento } from '../agendamentos/agendamento.entity';
import { DisponibilidadesService } from './disponibilidades.service';

@Module({
  imports: [TypeOrmModule.forFeature([Disponibilidade, Servico, Agendamento])],
  providers: [DisponibilidadesService],
  exports: [DisponibilidadesService],
})
export class DisponibilidadesModule {}
