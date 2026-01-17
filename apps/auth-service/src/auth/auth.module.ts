import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { User } from './entities/user.entity';
import { Credential } from './entities/credential.entity';
import { Role } from './entities/role.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { RoleAudit } from './entities/role-audit.entity';
import { Permission } from './entities/permission.entity';
import { InstitucionalStudent } from './entities/institucional-student.entity';
import { InstitucionalTeacher } from './entities/institucional-teacher.entity';
import { InstitucionalAudit } from './entities/institucional-audit.entity';
import { InstitucionalService } from './services/institucional.service';
import { AdminInstitucionalController } from './controllers/admin-institucional.controller';
import { RolesGuard } from './guards/roles.guard';
import { WinstonLoggerService } from '../common/logger.service';

@Module({
  imports: [
    PassportModule,
    ConfigModule,
    TypeOrmModule.forFeature([
      User, 
      Credential, 
      Role, 
      RefreshToken, 
      RoleAudit, 
      Permission,
      InstitucionalStudent,
      InstitucionalTeacher,
      InstitucionalAudit
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') || 'SECRET_KEY_DEMO',
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  controllers: [AuthController, AdminInstitucionalController],
  providers: [AuthService, JwtStrategy, InstitucionalService, RolesGuard, WinstonLoggerService],
  exports: [InstitucionalService, RolesGuard],
})
export class AuthModule {}
