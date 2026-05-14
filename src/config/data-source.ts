import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config as loadEnv } from 'dotenv';

import { Responsavel } from '../responsaveis/responsavel.entity';
import { Paciente } from '../pacientes/paciente.entity';
import { Profissional } from '../profissionais/profissional.entity';
import { Servico } from '../servicos/servico.entity';
import { Disponibilidade } from '../disponibilidades/disponibilidade.entity';
import { Agendamento } from '../agendamentos/agendamento.entity';

// Permite usar este DataSource em CLI (migrations/seed) e no AppModule
loadEnv();

const useDatabaseUrl = !!process.env.DATABASE_URL;

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  ...(useDatabaseUrl
    ? {
        url: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
      }
    : {
        host: process.env.DB_HOST ?? 'localhost',
        port: parseInt(process.env.DB_PORT ?? '5432', 10),
        username: process.env.DB_USER ?? 'agendaai',
        password: process.env.DB_PASSWORD ?? 'agendaai_dev',
        database: process.env.DB_NAME ?? 'agendaai',
      }),
  entities: [
    Responsavel,
    Paciente,
    Profissional,
    Servico,
    Disponibilidade,
    Agendamento,
  ],
  migrations: ['dist/migrations/*.js'],
  migrationsTableName: 'typeorm_migrations',
  synchronize: process.env.DB_SYNC === 'true',
};

// Default export para o CLI do TypeORM:
//   typeorm migration:generate -d src/config/data-source.ts ...
export default new DataSource(dataSourceOptions);
