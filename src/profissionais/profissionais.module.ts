import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profissional } from './profissional.entity';
import { ProfissionaisService } from './profissionais.service';
import { ProfissionaisController } from './profissionais.controller';
import { DisponibilidadesModule } from '../disponibilidades/disponibilidades.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Profissional]),
    DisponibilidadesModule,
  ],
  providers: [ProfissionaisService],
  controllers: [ProfissionaisController],
  exports: [ProfissionaisService],
})
export class ProfissionaisModule {}
