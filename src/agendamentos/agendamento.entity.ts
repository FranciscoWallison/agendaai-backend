import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Paciente } from '../pacientes/paciente.entity';
import { Profissional } from '../profissionais/profissional.entity';
import { Servico } from '../servicos/servico.entity';

export enum StatusAgendamento {
  AGENDADO = 'AGENDADO',
  CANCELADO = 'CANCELADO',
  CONCLUIDO = 'CONCLUIDO',
}

@Entity('agendamentos')
@Index('idx_prof_inicio', ['profissionalId', 'dataHoraInicio'])
export class Agendamento {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'paciente_id' })
  pacienteId: string;

  @ManyToOne(() => Paciente, (p) => p.agendamentos, { eager: true })
  @JoinColumn({ name: 'paciente_id' })
  paciente: Paciente;

  @Column({ name: 'profissional_id' })
  profissionalId: string;

  @ManyToOne(() => Profissional, (p) => p.agendamentos, { eager: true })
  @JoinColumn({ name: 'profissional_id' })
  profissional: Profissional;

  @Column({ name: 'servico_id' })
  servicoId: string;

  @ManyToOne(() => Servico, (s) => s.agendamentos, { eager: true })
  @JoinColumn({ name: 'servico_id' })
  servico: Servico;

  @Column({ name: 'data_hora_inicio', type: 'timestamptz' })
  dataHoraInicio: Date;

  @Column({ name: 'data_hora_fim', type: 'timestamptz' })
  dataHoraFim: Date;

  @Column({
    type: 'varchar',
    length: 20,
    default: StatusAgendamento.AGENDADO,
  })
  status: StatusAgendamento;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @Column({ name: 'cancelado_em', type: 'timestamptz', nullable: true })
  canceladoEm: Date | null;
}
