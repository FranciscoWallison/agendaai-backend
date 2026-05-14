import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Disponibilidade } from '../disponibilidades/disponibilidade.entity';
import { Agendamento } from '../agendamentos/agendamento.entity';

@Entity('profissionais')
export class Profissional {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column({ unique: true })
  crm: string;

  @Column({ default: 'Pediatria' })
  especialidade: string;

  @Column({ nullable: true })
  telefone: string;

  @Column({ default: true })
  ativo: boolean;

  @OneToMany(() => Disponibilidade, (d) => d.profissional)
  disponibilidades: Disponibilidade[];

  @OneToMany(() => Agendamento, (a) => a.profissional)
  agendamentos: Agendamento[];
}
