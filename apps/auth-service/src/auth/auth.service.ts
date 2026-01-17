import { Injectable, ConflictException, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { User } from './entities/user.entity';
import { Credential } from './entities/credential.entity';
import { Role } from './entities/role.entity';
import { RoleAudit } from './entities/role-audit.entity';
import { InstitucionalAudit } from './entities/institucional-audit.entity';
import { InstitucionalService } from './services/institucional.service';
import { WinstonLoggerService } from '../common/logger.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Credential) private readonly credRepo: Repository<Credential>,
    @InjectRepository(Role) private readonly roleRepo: Repository<Role>,
    @InjectRepository(RoleAudit) private readonly roleAuditRepo: Repository<RoleAudit>,
    @InjectRepository(InstitucionalAudit) private readonly institucionalAuditRepo: Repository<InstitucionalAudit>,
    private readonly jwtService: JwtService,
    private readonly institucionalService: InstitucionalService,
    private readonly logger: WinstonLoggerService,
  ) {}

  async register(dto: RegisterDto) {
    // 1. Validar dominio institucional
    if (!dto.email.endsWith('@uce.edu.ec')) {
      await this.createInstitucionalAudit(dto.email, 'REGISTER_FAILED', 'Email no es del dominio @uce.edu.ec', 'not_found');
      throw new UnauthorizedException('Solo emails institucionales @uce.edu.ec permitidos');
    }

    // 2. Validar en base de datos institucional
    const validation = await this.institucionalService.validateEmail(dto.email);
    if (!validation.isValid) {
      await this.createInstitucionalAudit(dto.email, 'REGISTER_FAILED', 'Email no encontrado en registros institucionales', 'not_found');
      throw new UnauthorizedException('Email no encontrado en registros institucionales');
    }

    // 3. Verificar si ya existe usuario local
    const existing = await this.userRepo.findOne({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email ya está registrado');

    // 4. Determinar rol automáticamente según tipo de usuario institucional
    let roleName = 'estudiante';
    if (validation.userType === 'teacher') {
      roleName = 'profesor';
    }

    const role = await this.roleRepo.findOne({ where: { name: roleName } });
    if (!role) {
      throw new UnauthorizedException(`Rol ${roleName} no encontrado`);
    }

    // 5. Crear usuario con datos institucionales
    const user = this.userRepo.create({
      email: dto.email,
      name: validation.userData?.name || dto.name,
      roles: [role]
    });

    const savedUser = await this.userRepo.save(user);

    // 6. Crear credencial
    const hash = await bcrypt.hash(dto.password, 10);
    const cred = this.credRepo.create({ user: savedUser, passwordHash: hash });
    await this.credRepo.save(cred);

    // 7. Crear registro de auditoría para asignación de rol
    await this.createRoleAudit(savedUser.id, role.id, 'ASSIGNED');

    // 8. Auditoría de registro exitoso
    await this.createInstitucionalAudit(
      dto.email,
      'REGISTER_SUCCESS',
      `Usuario creado exitosamente como ${roleName}`,
      validation.userType
    );

    return {
      id: savedUser.id,
      email: savedUser.email,
      name: savedUser.name,
      roles: savedUser.roles.map(r => ({
        id: r.id,
        name: r.name,
        level: r.level,
        description: r.description
      }))
    };
  }

  private async validateUser(email: string, password: string) {
    const user = await this.userRepo.findOne({ 
      where: { email }, 
      relations: ['credentials', 'roles'] 
    });
    if (!user) return null;

    const passwordCred = user.credentials?.find((c) => c.type === 'password');
    if (!passwordCred) return null;

    const match = await bcrypt.compare(password, passwordCred.passwordHash);
    if (!match) return null;

    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles?.map((r) => r.name) || [],
    };

    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles?.map(r => ({
          id: r.id,
          name: r.name,
          level: r.level
        }))
      }
    };
  }

  private async createRoleAudit(userId: string, roleId: string, action: 'CREATED' | 'ASSIGNED' | 'REMOVED' | 'UPDATED') {
    const audit = this.roleAuditRepo.create({
      userId,
      roleId,
      action
    });
    await this.roleAuditRepo.save(audit);
  }

  private async createInstitucionalAudit(
    email: string,
    action: 'VALIDATION_SUCCESS' | 'VALIDATION_FAILED' | 'REGISTER_SUCCESS' | 'REGISTER_FAILED',
    details: string,
    userType?: 'student' | 'teacher' | 'not_found'
  ): Promise<void> {
    const audit = this.institucionalAuditRepo.create({
      email,
      action,
      details,
      userType
    });

    await this.institucionalAuditRepo.save(audit);
  }
}