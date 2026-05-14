import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.use(helmet());

  // CORS_ORIGINS=https://app1.com,https://app2.com  (separado por virgula)
  // Em dev (vazio), libera tudo para facilitar.
  const origins = (process.env.CORS_ORIGINS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  app.enableCors({
    origin: origins.length > 0 ? origins : true,
    credentials: true,
  });

  // Render coloca o servico atras de proxy - precisamos confiar nele
  // para o throttler ler o IP correto via X-Forwarded-For.
  app.set('trust proxy', 1);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('agendaAI API')
    .setDescription('Agendamento de atendimento pediatrico')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`agendaAI API on port ${port}`);
  console.log(`Swagger:           /api/docs`);
  console.log(`Health:            /health`);
  console.log(
    `Timezone:          ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
  );
  console.log(
    `DB:                ${process.env.DATABASE_URL ? 'DATABASE_URL (managed)' : process.env.DB_HOST}`,
  );
}
bootstrap();
