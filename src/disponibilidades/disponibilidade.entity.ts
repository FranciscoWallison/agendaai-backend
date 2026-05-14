import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profissional } from '../profissionais/profissional.entity';

@Entity('disponibilidades')
export class Disponibilidade {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'profissional_id' })
  profissionalId: string;

  @ManyToOne(() => Profissional, (p) => p.disponibilidades, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'profissional_id' })
  profissional: Profissional;

  @Column({ name: 'dia_semana', type: 'int' })
  diaSemana: number;

  @Column({ name: 'hora_inicio', type: 'varchar', length: 5 })
  horaInicio: string;

  @Column({ name: 'hora_fim', type: 'varchar', length: 5 })
  horaFim: string;
}
