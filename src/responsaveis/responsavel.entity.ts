import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Paciente } from '../pacientes/paciente.entity';

@Entity('responsaveis')
export class Responsavel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'senha_hash' })
  senhaHash: string;

  @Column({ nullable: true })
  telefone: string;

  @CreateDateColumn({ name: 'criado_em' })
  criadoEm: Date;

  @OneToMany(() => Paciente, (p) => p.responsavel)
  pacientes: Paciente[];
}
