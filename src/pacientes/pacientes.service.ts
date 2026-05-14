import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Paciente } from './paciente.entity';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';

@Injectable()
export class PacientesService {
  constructor(
    @InjectRepository(Paciente)
    private readonly repo: Repository<Paciente>,
  ) {}

  list(responsavelId: string) {
    return this.repo.find({
      where: { responsavelId, ativo: true },
      order: { nome: 'ASC' },
    });
  }

  async findOne(id: string, responsavelId: string) {
    const p = await this.repo.findOne({ where: { id, ativo: true } });
    if (!p) throw new NotFoundException('Paciente nao encontrado');
    if (p.responsavelId !== responsavelId) throw new ForbiddenException();
    return p;
  }

  create(responsavelId: string, dto: CreatePacienteDto) {
    const p = this.repo.create({
      ...dto,
      sexo: dto.sexo ?? 'O',
      responsavelId,
    });
    return this.repo.save(p);
  }

  async update(id: string, responsavelId: string, dto: UpdatePacienteDto) {
    const p = await this.findOne(id, responsavelId);
    Object.assign(p, dto);
    return this.repo.save(p);
  }

  async remove(id: string, responsavelId: string) {
    const p = await this.findOne(id, responsavelId);
    p.ativo = false;
    await this.repo.save(p);
    return { ok: true };
  }
}
