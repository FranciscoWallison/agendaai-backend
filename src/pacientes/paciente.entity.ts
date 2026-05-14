import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Responsavel } from '../responsaveis/responsavel.entity';
import { Agendamento } from '../agendamentos/agendamento.entity';

export type Sexo = 'M' | 'F' | 'O';

@Entity('pacientes')
export class Paciente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'responsavel_id' })
  responsavelId: string;

  @ManyToOne(() => Responsavel, (r) => r.pacientes, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'responsavel_id' })
  responsavel: Responsavel;

  @Column()
  nome: string;

  @Column({ name: 'data_nascimento', type: 'date' })
  dataNascimento: string;

  @Column({ type: 'varchar', length: 1, default: 'O' })
  sexo: Sexo;

  @Column({ type: 'text', nullable: true })
  observacoes: string;

  @Column({ default: true })
  ativo: boolean;

  @OneToMany(() => Agendamento, (a) => a.paciente)
  agendamentos: Agendamento[];
}
