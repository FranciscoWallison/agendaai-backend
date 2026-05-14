import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { dataSourceOptions } from './config/data-source';
import { AuthModule } from './auth/auth.module';
import { PacientesModule } from './pacientes/pacientes.module';
import { ProfissionaisModule } from './profissionais/profissionais.module';
import { ServicosModule } from './servicos/servicos.module';
import { DisponibilidadesModule } from './disponibilidades/disponibilidades.module';
import { AgendamentosModule } from './agendamentos/agendamentos.module';
import { NotificacoesModule } from './notificacoes/notificacoes.module';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ name: 'default', ttl: 60_000, limit: 60 }]),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    PacientesModule,
    ProfissionaisModule,
    ServicosModule,
    DisponibilidadesModule,
    AgendamentosModule,
    NotificacoesModule,
  ],
  controllers: [HealthController],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
