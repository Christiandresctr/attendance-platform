import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { LoggingInterceptor } from './common/logging.interceptor.simple';
import { WinstonLoggerService } from './common/logger.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService) => {
        const isTest = configService.get('NODE_ENV') === 'test';
        const dbType = configService.get('DB_TYPE', 'postgres');

        // Configuración para SQLite (tests)
        if (dbType === 'sqlite') {
          return {
            type: 'sqlite',
            database: configService.get('DB_DATABASE') || ':memory:',
            autoLoadEntities: true,
            synchronize: true,
            logging: false,
            dropSchema: isTest,
          };
        }

        // Configuración para PostgreSQL (desarrollo/producción)
        return {
          type: 'postgres',
          url: configService.get('DATABASE_URL') || 
            `postgresql://${configService.get('DB_USER', 'postgres')}:${configService.get('DB_PASSWORD', 'mejo2127')}@${configService.get('DB_HOST', 'localhost')}:${configService.get('DB_PORT', '5433')}/${configService.get('DB_NAME', 'auth_service_dev')}`,
          ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
          autoLoadEntities: true,
          synchronize: configService.get('NODE_ENV') === 'development' || isTest,
          logging: configService.get('NODE_ENV') === 'development' && !isTest,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          migrations: [__dirname + '/migrations/*{.ts,.js}'],
          migrationsRun: configService.get('NODE_ENV') === 'production',
          dropSchema: isTest,
          extra: !isTest ? {
            max: 20,
            min: 5,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
          } : undefined,
        };
      },
      inject: [ConfigService],
    }),

    AuthModule,
    // HealthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    WinstonLoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  exports: [WinstonLoggerService],
})
export class AppModule {}
