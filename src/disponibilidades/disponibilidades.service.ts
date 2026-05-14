import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Disponibilidade } from './disponibilidade.entity';
import { Servico } from '../servicos/servico.entity';
import {
  Agendamento,
  StatusAgendamento,
} from '../agendamentos/agendamento.entity';

export interface SlotLivre {
  inicio: string;
  fim: string;
}

@Injectable()
export class DisponibilidadesService {
  constructor(
    @InjectRepository(Disponibilidade)
    private readonly repo: Repository<Disponibilidade>,
    @InjectRepository(Servico)
    private readonly servicos: Repository<Servico>,
    @InjectRepository(Agendamento)
    private readonly agendamentos: Repository<Agendamento>,
  ) {}

  listByProfissional(profissionalId: string) {
    return this.repo.find({
      where: { profissionalId },
      order: { diaSemana: 'ASC', horaInicio: 'ASC' },
    });
  }

  async slotsLivres(
    profissionalId: string,
    data: string,
    servicoId: string,
  ): Promise<SlotLivre[]> {
    if (!data) {
      throw new BadRequestException('Parametro `data` (YYYY-MM-DD) obrigatorio');
    }
    if (!servicoId) {
      throw new BadRequestException('Parametro `servicoId` obrigatorio');
    }

    const servico = await this.servicos.findOne({ where: { id: servicoId } });
    if (!servico) throw new NotFoundException('Servico nao encontrado');

    const dataRef = new Date(`${data}T00:00:00`);
    const diaSemana = dataRef.getDay();

    const janelas = await this.repo.find({
      where: { profissionalId, diaSemana },
    });
    if (janelas.length === 0) return [];

    const inicioDia = new Date(`${data}T00:00:00`);
    const fimDia = new Date(`${data}T23:59:59.999`);

    const ocupados = await this.agendamentos
      .createQueryBuilder('a')
      .where('a.profissional_id = :profissionalId', { profissionalId })
      .andWhere('a.status != :cancelado', {
        cancelado: StatusAgendamento.CANCELADO,
      })
      .andWhere('a.data_hora_inicio >= :inicio', { inicio: inicioDia })
      .andWhere('a.data_hora_inicio <= :fim', { fim: fimDia })
      .getMany();

    const livres: SlotLivre[] = [];
    for (const j of janelas) {
      const slots = this.gerarSlots(data, j.horaInicio, j.horaFim, servico.duracaoMinutos);
      for (const slot of slots) {
        const conflita = ocupados.some((o) =>
          this.sobrepoe(
            new Date(slot.inicio),
            new Date(slot.fim),
            new Date(o.dataHoraInicio),
            new Date(o.dataHoraFim),
          ),
        );
        if (!conflita) livres.push(slot);
      }
    }
    return livres;
  }

  private gerarSlots(
    data: string,
    horaInicio: string,
    horaFim: string,
    duracaoMin: number,
  ): SlotLivre[] {
    const slots: SlotLivre[] = [];
    const cursor = new Date(`${data}T${horaInicio}:00`);
    const fim = new Date(`${data}T${horaFim}:00`);
    while (cursor.getTime() + duracaoMin * 60_000 <= fim.getTime()) {
      const inicio = new Date(cursor);
      const fimSlot = new Date(cursor.getTime() + duracaoMin * 60_000);
      slots.push({ inicio: inicio.toISOString(), fim: fimSlot.toISOString() });
      cursor.setMinutes(cursor.getMinutes() + duracaoMin);
    }
    return slots;
  }

  private sobrepoe(aIni: Date, aFim: Date, bIni: Date, bFim: Date) {
    return aIni < bFim && bIni < aFim;
  }
}
