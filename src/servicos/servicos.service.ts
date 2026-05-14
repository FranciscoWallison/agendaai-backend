import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Servico } from './servico.entity';

@Injectable()
export class ServicosService {
  constructor(
    @InjectRepository(Servico)
    private readonly repo: Repository<Servico>,
  ) {}

  list() {
    return this.repo.find({ order: { nome: 'ASC' } });
  }

  async findOne(id: string) {
    const s = await this.repo.findOne({ where: { id } });
    if (!s) throw new NotFoundException('Servico nao encontrado');
    return s;
  }
}
