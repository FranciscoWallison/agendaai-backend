import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { dataSourceOptions } from '../config/data-source';
import { Profissional } from '../profissionais/profissional.entity';
import { Servico } from '../servicos/servico.entity';
import { Disponibilidade } from '../disponibilidades/disponibilidade.entity';

async function run() {
  const ds = new DataSource(dataSourceOptions);
  await ds.initialize();

  const profRepo = ds.getRepository(Profissional);
  const servRepo = ds.getRepository(Servico);
  const dispRepo = ds.getRepository(Disponibilidade);

  if ((await profRepo.count()) === 0) {
    const dra = await profRepo.save(
      profRepo.create({
        nome: 'Dra. Marina Souza',
        crm: 'CRM-SP 123456',
        especialidade: 'Pediatria',
        telefone: '+55 11 99999-0001',
      }),
    );
    const dr = await profRepo.save(
      profRepo.create({
        nome: 'Dr. Felipe Lima',
        crm: 'CRM-SP 654321',
        especialidade: 'Pediatria',
        telefone: '+55 11 99999-0002',
      }),
    );

    for (const prof of [dra, dr]) {
      for (let dia = 1; dia <= 5; dia++) {
        await dispRepo.save(
          dispRepo.create({
            profissionalId: prof.id,
            diaSemana: dia,
            horaInicio: '08:00',
            horaFim: '12:00',
          }),
        );
        await dispRepo.save(
          dispRepo.create({
            profissionalId: prof.id,
            diaSemana: dia,
            horaInicio: '14:00',
            horaFim: '18:00',
          }),
        );
      }
    }
    console.log('Profissionais e disponibilidades criados.');
  } else {
    console.log('Profissionais ja existem - skip.');
  }

  if ((await servRepo.count()) === 0) {
    await servRepo.save([
      servRepo.create({
        nome: 'Consulta de rotina',
        duracaoMinutos: 30,
        precoCentavos: 25000,
      }),
      servRepo.create({
        nome: 'Retorno',
        duracaoMinutos: 20,
        precoCentavos: 15000,
      }),
      servRepo.create({
        nome: 'Vacinacao',
        duracaoMinutos: 15,
        precoCentavos: 12000,
      }),
      servRepo.create({
        nome: 'Avaliacao neuropediatrica',
        duracaoMinutos: 60,
        precoCentavos: 45000,
      }),
    ]);
    console.log('Servicos criados.');
  } else {
    console.log('Servicos ja existem - skip.');
  }

  await ds.destroy();
  console.log('Seed concluido.');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
