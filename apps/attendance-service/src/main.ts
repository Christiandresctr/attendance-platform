import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // elimina campos que no estén en el DTO
      forbidNonWhitelisted: true, // lanza error si mandan campos extra
      transform: true,            // transforma tipos automáticamente
    }),
  );

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`Attendance service listening on port ${port}`);
}

bootstrap();
