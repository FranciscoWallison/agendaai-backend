import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profissional } from './profissional.entity';

@Injectable()
export class ProfissionaisService {
  constructor(
    @InjectRepository(Profissional)
    private readonly repo: Repository<Profissional>,
  ) {}

  list() {
    return this.repo.find({
      where: { ativo: true },
      order: { nome: 'ASC' },
    });
  }

  async findOne(id: string) {
    const p = await this.repo.findOne({ where: { id } });
    if (!p) throw new NotFoundException('Profissional nao encontrado');
    return p;
  }
}
