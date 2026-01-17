import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { Role } from '../src/auth/entities/role.entity';
import { Permission } from '../src/auth/entities/permission.entity';
import { PermissionResource, PermissionAction } from '../src/auth/entities/permission.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  console.log('🌱 Inicializando roles y permisos...');

  try {
    // Crear permisos básicos
    const permissions = [
      // Usuarios
      { name: 'user:create', resource: PermissionResource.USER, action: PermissionAction.CREATE, description: 'Crear usuarios' },
      { name: 'user:read', resource: PermissionResource.USER, action: PermissionAction.READ, description: 'Leer información de usuarios' },
      { name: 'user:update', resource: PermissionResource.USER, action: PermissionAction.UPDATE, description: 'Actualizar información de usuarios' },
      { name: 'user:delete', resource: PermissionResource.USER, action: PermissionAction.DELETE, description: 'Eliminar usuarios' },
      
      // Roles
      { name: 'role:create', resource: PermissionResource.ROLE, action: PermissionAction.CREATE, description: 'Crear roles' },
      { name: 'role:read', resource: PermissionResource.ROLE, action: PermissionAction.READ, description: 'Leer información de roles' },
      { name: 'role:update', resource: PermissionResource.ROLE, action: PermissionAction.UPDATE, description: 'Actualizar roles' },
      { name: 'role:delete', resource: PermissionResource.ROLE, action: PermissionAction.DELETE, description: 'Eliminar roles' },
      
      // Asistencia
      { name: 'attendance:create', resource: PermissionResource.ATTENDANCE, action: PermissionAction.CREATE, description: 'Registrar asistencia' },
      { name: 'attendance:read', resource: PermissionResource.ATTENDANCE, action: PermissionAction.READ, description: 'Ver registros de asistencia' },
      { name: 'attendance:update', resource: PermissionResource.ATTENDANCE, action: PermissionAction.UPDATE, description: 'Modificar registros de asistencia' },
      { name: 'attendance:delete', resource: PermissionResource.ATTENDANCE, action: PermissionAction.DELETE, description: 'Eliminar registros de asistencia' },
      { name: 'attendance:manage', resource: PermissionResource.ATTENDANCE, action: PermissionAction.MANAGE, description: 'Gestionar asistencia completa' },
      
      // Clases
      { name: 'class:create', resource: PermissionResource.CLASS, action: PermissionAction.CREATE, description: 'Crear clases' },
      { name: 'class:read', resource: PermissionResource.CLASS, action: PermissionAction.READ, description: 'Ver información de clases' },
      { name: 'class:update', resource: PermissionResource.CLASS, action: PermissionAction.UPDATE, description: 'Actualizar clases' },
      { name: 'class:delete', resource: PermissionResource.CLASS, action: PermissionAction.DELETE, description: 'Eliminar clases' },
      
      // Horarios
      { name: 'schedule:create', resource: PermissionResource.SCHEDULE, action: PermissionAction.CREATE, description: 'Crear horarios' },
      { name: 'schedule:read', resource: PermissionResource.SCHEDULE, action: PermissionAction.READ, description: 'Ver horarios' },
      { name: 'schedule:update', resource: PermissionResource.SCHEDULE, action: PermissionAction.UPDATE, description: 'Actualizar horarios' },
      { name: 'schedule:delete', resource: PermissionResource.SCHEDULE, action: PermissionAction.DELETE, description: 'Eliminar horarios' },
      
      // Reportes
      { name: 'report:create', resource: PermissionResource.REPORT, action: PermissionAction.CREATE, description: 'Generar reportes' },
      { name: 'report:read', resource: PermissionResource.REPORT, action: PermissionAction.READ, description: 'Ver reportes' },
    ];

    // Insertar permisos si no existen
    for (const permData of permissions) {
      const existingPerm = await dataSource.getRepository(Permission).findOne({
        where: { name: permData.name }
      });
      
      if (!existingPerm) {
        const permission = dataSource.getRepository(Permission).create(permData);
        await dataSource.getRepository(Permission).save(permission);
        console.log(`✅ Permiso creado: ${permData.name}`);
      } else {
        console.log(`ℹ️  Permiso ya existe: ${permData.name}`);
      }
    }

    // Definir roles con sus permisos
    const rolesDefinition = [
      {
        name: 'estudiante',
        description: 'Estudiante del sistema',
        level: 30,
        isSystem: true,
        permissions: [
          'attendance:read',
          'class:read',
          'schedule:read',
          'report:read',
          'user:read' // Solo puede leer su propia información
        ]
      },
      {
        name: 'profesor',
        description: 'Profesor del sistema',
        level: 20,
        isSystem: true,
        permissions: [
          'attendance:create',
          'attendance:read',
          'attendance:update',
          'class:read',
          'schedule:read',
          'report:create',
          'report:read',
          'user:read', // Puede leer información de estudiantes en sus clases
          'user:update' // Puede actualizar información básica de estudiantes
        ]
      },
      {
        name: 'administrador',
        description: 'Administrador del sistema',
        level: 10,
        isSystem: true,
        permissions: [
          'user:create',
          'user:read',
          'user:update',
          'user:delete',
          'role:create',
          'role:read',
          'role:update',
          'role:delete',
          'attendance:create',
          'attendance:read',
          'attendance:update',
          'attendance:delete',
          'attendance:manage',
          'class:create',
          'class:read',
          'class:update',
          'class:delete',
          'schedule:create',
          'schedule:read',
          'schedule:update',
          'schedule:delete',
          'report:create',
          'report:read'
        ]
      }
    ];

    // Insertar roles si no existen
    for (const roleData of rolesDefinition) {
      const existingRole = await dataSource.getRepository(Role).findOne({
        where: { name: roleData.name }
      });
      
      if (!existingRole) {
        const role = dataSource.getRepository(Role).create({
          ...roleData,
          permissions: roleData.permissions
        });
        
        await dataSource.getRepository(Role).save(role);
        console.log(`✅ Rol creado: ${roleData.name} con ${roleData.permissions.length} permisos`);
      } else {
        console.log(`ℹ️  Rol ya existe: ${roleData.name}`);
      }
    }

    console.log('🎉 Inicialización de roles y permisos completada exitosamente');
  } catch (error) {
    console.error('❌ Error durante la inicialización:', error);
    throw error;
  } finally {
    await app.close();
  }
}

bootstrap().catch(console.error);