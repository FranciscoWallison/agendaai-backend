import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Agendamento, StatusAgendamento } from './agendamento.entity';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { Paciente } from '../pacientes/paciente.entity';
import { Profissional } from '../profissionais/profissional.entity';
import { Servico } from '../servicos/servico.entity';

@Injectable()
export class AgendamentosService {
  constructor(
    @InjectRepository(Agendamento)
    private readonly repo: Repository<Agendamento>,
    @InjectRepository(Paciente)
    private readonly pacientes: Repository<Paciente>,
    private readonly dataSource: DataSource,
  ) {}

  async create(responsavelId: string, dto: CreateAgendamentoDto) {
    try {
      return await this.dataSource.transaction('SERIALIZABLE', async (tx) => {
        const paciente = await tx
          .getRepository(Paciente)
          .findOne({ where: { id: dto.pacienteId, ativo: true } });
        if (!paciente) throw new NotFoundException('Paciente nao encontrado');
        if (paciente.responsavelId !== responsavelId) {
          throw new ForbiddenException('Paciente nao pertence ao responsavel');
        }

        const profissional = await tx
          .getRepository(Profissional)
          .findOne({ where: { id: dto.profissionalId } });
        if (!profissional)
          throw new NotFoundException('Profissional nao encontrado');

        const servico = await tx
          .getRepository(Servico)
          .findOne({ where: { id: dto.servicoId } });
        if (!servico) throw new NotFoundException('Servico nao encontrado');

        const inicio = new Date(dto.dataHoraInicio);
        const fim = new Date(
          inicio.getTime() + servico.duracaoMinutos * 60_000,
        );

        const conflito = await tx
          .getRepository(Agendamento)
          .createQueryBuilder('a')
          .where('a.profissional_id = :pid', { pid: dto.profissionalId })
          .andWhere('a.status != :cancelado', {
            cancelado: StatusAgendamento.CANCELADO,
          })
          .andWhere('a.data_hora_inicio < :fim AND a.data_hora_fim > :inicio', {
            inicio,
            fim,
          })
          .getCount();

        if (conflito > 0) {
          throw new ConflictException(
            'Horario ja ocupado para esse profissional',
          );
        }

        const agendamento = tx.getRepository(Agendamento).create({
          pacienteId: dto.pacienteId,
          profissionalId: dto.profissionalId,
          servicoId: dto.servicoId,
          dataHoraInicio: inicio,
          dataHoraFim: fim,
          observacoes: dto.observacoes,
          status: StatusAgendamento.AGENDADO,
        });
        return tx.getRepository(Agendamento).save(agendamento);
      });
    } catch (e: any) {
      // Postgres serialization failure: outro request marcou o mesmo slot
      if (e?.code === '40001') {
        throw new ConflictException(
          'Conflito de horario detectado em transacao concorrente, tente novamente',
        );
      }
      throw e;
    }
  }

  async list(responsavelId: string) {
    return this.repo
      .createQueryBuilder('a')
      .leftJoinAndSelect('a.paciente', 'paciente')
      .leftJoinAndSelect('a.profissional', 'profissional')
      .leftJoinAndSelect('a.servico', 'servico')
      .where('paciente.responsavel_id = :rid', { rid: responsavelId })
      .orderBy('a.data_hora_inicio', 'DESC')
      .getMany();
  }

  async cancel(id: string, responsavelId: string) {
    const a = await this.repo.findOne({ where: { id } });
    if (!a) throw new NotFoundException('Agendamento nao encontrado');

    const paciente = await this.pacientes.findOne({
      where: { id: a.pacienteId },
    });
    if (!paciente || paciente.responsavelId !== responsavelId) {
      throw new ForbiddenException();
    }
    if (a.status === StatusAgendamento.CANCELADO) {
      return a;
    }
    a.status = StatusAgendamento.CANCELADO;
    a.canceladoEm = new Date();
    return this.repo.save(a);
  }
}
