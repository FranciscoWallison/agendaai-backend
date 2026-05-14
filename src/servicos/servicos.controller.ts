import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ServicosService } from './servicos.service';

@ApiTags('servicos')
@Controller('servicos')
export class ServicosController {
  constructor(private readonly service: ServicosService) {}

  @Get()
  list() {
    return this.service.list();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
