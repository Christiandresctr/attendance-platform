import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { Role } from '../src/auth/entities/role.entity';
import { Permission } from '../src/auth/entities/permission.entity';

async function verifyRoles() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  console.log('🔍 Verificando roles y permisos creados...');

  try {
    // Verificar todos los roles
    const roles = await dataSource.getRepository(Role).find();
    console.log(`\n📋 Total roles encontrados: ${roles.length}`);
    
    roles.forEach(role => {
      console.log(`\n🔹 Rol: ${role.name}`);
      console.log(`   Descripción: ${role.description}`);
      console.log(`   Nivel: ${role.level}`);
      console.log(`   Es sistema: ${role.isSystem}`);
      console.log(`   Permisos: ${role.permissions ? role.permissions.length : 0} permisos`);
      if (role.permissions && role.permissions.length > 0) {
        console.log(`   Lista: ${role.permissions.join(', ')}`);
      }
    });

    // Verificar todos los permisos
    const permissions = await dataSource.getRepository(Permission).find();
    console.log(`\n📋 Total permisos encontrados: ${permissions.length}`);
    
    const permissionsByResource = permissions.reduce((acc, perm) => {
      if (!acc[perm.resource]) acc[perm.resource] = [];
      acc[perm.resource].push(perm.action);
      return acc;
    }, {} as Record<string, string[]>);

    Object.entries(permissionsByResource).forEach(([resource, actions]) => {
      console.log(`\n🔸 ${resource}: ${actions.join(', ')}`);
    });

    console.log('\n✅ Verificación completada exitosamente');
  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
    throw error;
  } finally {
    await app.close();
  }
}

verifyRoles().catch(console.error);