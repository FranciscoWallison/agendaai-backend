import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProfissionaisService } from './profissionais.service';
import { DisponibilidadesService } from '../disponibilidades/disponibilidades.service';

@ApiTags('profissionais')
@Controller('profissionais')
export class ProfissionaisController {
  constructor(
    private readonly profissionais: ProfissionaisService,
    private readonly disponibilidades: DisponibilidadesService,
  ) {}

  @Get()
  list() {
    return this.profissionais.list();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profissionais.findOne(id);
  }

  @Get(':id/disponibilidades')
  disponibilidadesDoProfissional(@Param('id') id: string) {
    return this.disponibilidades.listByProfissional(id);
  }

  @Get(':id/slots')
  slots(
    @Param('id') id: string,
    @Query('data') data: string,
    @Query('servicoId') servicoId: string,
  ) {
    return this.disponibilidades.slotsLivres(id, data, servicoId);
  }
}
