import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtStrategy } from './security/jwt.strategy';
import { RolesGuard } from './security/roles.guard';
import { Attendance } from './attendance/attendance.entity';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SECRET_KEY_DEMO',
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'mejo2127',
      database: 'auth_service_dev',
      autoLoadEntities: true,
      synchronize: true,
    }),

    TypeOrmModule.forFeature([Attendance]),
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy, RolesGuard],
})
export class AppModule {}