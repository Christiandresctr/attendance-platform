import 'reflect-metadata';
import { ConfigModule } from '@nestjs/config';

// Configuración global para tests
// Cargar variables de entorno de test
ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: '.env.test',
});

// Configuración global de timeouts para tests
jest.setTimeout(30000);