import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

const logger = new Logger('API Gateway Bootstrap');

async function bootstrap() {
  try {
    logger.log('Creating Nest application...');
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);

    app.enableCors({
      origin: '*',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    });

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    const port = configService.port;

    await app.listen(port);

    logger.log(`✅ API Gateway running on port ${port}`);
    logger.log(`📝 Environment: ${configService.nodeEnv}`);
    logger.log(`🔐 Auth Service: ${configService.authServiceUrl}`);
    logger.log(`📊 Attendance Service: ${configService.attendanceServiceUrl}`);

    setupGracefulShutdown(app);

  } catch (error) {
    logger.error(
      '❌ Failed to start API Gateway',
      error instanceof Error ? error.message : String(error),
    );
    process.exit(1);
  }
}

function setupGracefulShutdown(app: any) {
  const shutdown = async (signal: string) => {
    logger.log(`Received ${signal}, shutting down...`);
    await app.close();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

void bootstrap();
