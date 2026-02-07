import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const databaseConfig = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => {
    const isTest = configService.get('NODE_ENV') === 'test';
    const dbType = configService.get('DB_TYPE', 'postgres');

    // Configuración para SQLite (tests)
    if (dbType === 'sqlite') {
      return {
        type: 'sqlite' as const,
        database: (configService.get('DB_DATABASE') || ':memory:') as string,
        autoLoadEntities: true,
        synchronize: true,
        logging: false,
        dropSchema: isTest,
      };
    }

    // Configuración para PostgreSQL (desarrollo/producción)
    return {
      type: 'postgres' as const,
      url: configService.get('DATABASE_URL') || 
        `postgresql://${configService.get('DB_USER', 'postgres')}:${configService.get('DB_PASSWORD', 'mejo2127')}@${configService.get('DB_HOST', 'localhost')}:${configService.get('DB_PORT', '5432')}/${configService.get('DB_NAME', 'attendance_service_dev')}`,
      ssl: configService.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
      autoLoadEntities: true,
      synchronize: configService.get('NODE_ENV') === 'development' || isTest,
      logging: configService.get('NODE_ENV') === 'development' && !isTest,
      entities: [
        __dirname + '/**/*.entity{.ts,.js}',
      ],
      dropSchema: isTest,
    };
  },
  inject: [ConfigService],
});