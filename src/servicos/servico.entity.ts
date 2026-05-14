import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Agendamento } from '../agendamentos/agendamento.entity';

@Entity('servicos')
export class Servico {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nome: string;

  @Column({ name: 'duracao_minutos', type: 'int' })
  duracaoMinutos: number;

  @Column({ name: 'preco_centavos', type: 'int', default: 0 })
  precoCentavos: number;

  @OneToMany(() => Agendamento, (a) => a.servico)
  agendamentos: Agendamento[];
}
