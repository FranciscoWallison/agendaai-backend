import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1778708821548 implements MigrationInterface {
    name = 'InitialSchema1778708821548'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
        await queryRunner.query(`CREATE TABLE "disponibilidades" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "profissional_id" uuid NOT NULL, "dia_semana" integer NOT NULL, "hora_inicio" character varying(5) NOT NULL, "hora_fim" character varying(5) NOT NULL, CONSTRAINT "PK_f186e2cf9a761708cd5f6bf1b87" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "profissionais" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying NOT NULL, "crm" character varying NOT NULL, "especialidade" character varying NOT NULL DEFAULT 'Pediatria', "telefone" character varying, "ativo" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_aabac78d40a95c67634119e855a" UNIQUE ("crm"), CONSTRAINT "PK_a6a3048111c78bd06ecd3b1360c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "servicos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying NOT NULL, "duracao_minutos" integer NOT NULL, "preco_centavos" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_91c99670ea2115d2028a48c5e0e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "agendamentos" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "paciente_id" uuid NOT NULL, "profissional_id" uuid NOT NULL, "servico_id" uuid NOT NULL, "data_hora_inicio" TIMESTAMP WITH TIME ZONE NOT NULL, "data_hora_fim" TIMESTAMP WITH TIME ZONE NOT NULL, "status" character varying(20) NOT NULL DEFAULT 'AGENDADO', "observacoes" text, "criado_em" TIMESTAMP NOT NULL DEFAULT now(), "cancelado_em" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_3890b7448ebc7efdfd1d43bf0c7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "idx_prof_inicio" ON "agendamentos" ("profissional_id", "data_hora_inicio") `);
        await queryRunner.query(`CREATE TABLE "pacientes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "responsavel_id" uuid NOT NULL, "nome" character varying NOT NULL, "data_nascimento" date NOT NULL, "sexo" character varying(1) NOT NULL DEFAULT 'O', "observacoes" text, "ativo" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_aa9c9f624ff22fc06c44d8b1609" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "responsaveis" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome" character varying NOT NULL, "email" character varying NOT NULL, "senha_hash" character varying NOT NULL, "telefone" character varying, "criado_em" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_fa6d27edac80042d1b2080cb02f" UNIQUE ("email"), CONSTRAINT "PK_79aa857625cefa30a1eb63b1209" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "disponibilidades" ADD CONSTRAINT "FK_d26b4da35e9d611cbf996ba384f" FOREIGN KEY ("profissional_id") REFERENCES "profissionais"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "agendamentos" ADD CONSTRAINT "FK_6d126dfca43749da338ef17bb64" FOREIGN KEY ("paciente_id") REFERENCES "pacientes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "agendamentos" ADD CONSTRAINT "FK_f4c50f34d5ebdd8581391242269" FOREIGN KEY ("profissional_id") REFERENCES "profissionais"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "agendamentos" ADD CONSTRAINT "FK_32b9bd3190245a0077cdf41d95f" FOREIGN KEY ("servico_id") REFERENCES "servicos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pacientes" ADD CONSTRAINT "FK_9b3cf15a8b48b0519915ff799f5" FOREIGN KEY ("responsavel_id") REFERENCES "responsaveis"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pacientes" DROP CONSTRAINT "FK_9b3cf15a8b48b0519915ff799f5"`);
        await queryRunner.query(`ALTER TABLE "agendamentos" DROP CONSTRAINT "FK_32b9bd3190245a0077cdf41d95f"`);
        await queryRunner.query(`ALTER TABLE "agendamentos" DROP CONSTRAINT "FK_f4c50f34d5ebdd8581391242269"`);
        await queryRunner.query(`ALTER TABLE "agendamentos" DROP CONSTRAINT "FK_6d126dfca43749da338ef17bb64"`);
        await queryRunner.query(`ALTER TABLE "disponibilidades" DROP CONSTRAINT "FK_d26b4da35e9d611cbf996ba384f"`);
        await queryRunner.query(`DROP TABLE "responsaveis"`);
        await queryRunner.query(`DROP TABLE "pacientes"`);
        await queryRunner.query(`DROP INDEX "public"."idx_prof_inicio"`);
        await queryRunner.query(`DROP TABLE "agendamentos"`);
        await queryRunner.query(`DROP TABLE "servicos"`);
        await queryRunner.query(`DROP TABLE "profissionais"`);
        await queryRunner.query(`DROP TABLE "disponibilidades"`);
    }

}
