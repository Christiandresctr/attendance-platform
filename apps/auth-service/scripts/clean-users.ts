import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { User } from '../src/auth/entities/user.entity';
import { Credential } from '../src/auth/entities/credential.entity';
import { RoleAudit } from '../src/auth/entities/role-audit.entity';
import { InstitucionalAudit } from '../src/auth/entities/institucional-audit.entity';

async function cleanExistingData() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  console.log('🧹 Iniciando limpieza de datos existentes...');

  try {
    // 1. Eliminar todos los usuarios existentes
    const userRepo = dataSource.getRepository(User);
    const userCount = await userRepo.count();
    
    if (userCount > 0) {
      await userRepo.createQueryBuilder().delete().from(User).execute();
      console.log(`✅ ${userCount} usuarios eliminados de la tabla users`);
    } else {
      console.log('ℹ️  No hay usuarios en la tabla users');
    }

    // 2. Eliminar todas las credenciales
    const credRepo = dataSource.getRepository(Credential);
    const credCount = await credRepo.count();
    
    if (credCount > 0) {
      await credRepo.createQueryBuilder().delete().from(Credential).execute();
      console.log(`✅ ${credCount} credenciales eliminadas de la tabla credentials`);
    } else {
      console.log('ℹ️  No hay credenciales en la tabla credentials');
    }

    // 3. Limpiar auditoría de roles
    const roleAuditRepo = dataSource.getRepository(RoleAudit);
    const roleAuditCount = await roleAuditRepo.count();
    
    if (roleAuditCount > 0) {
      await roleAuditRepo.createQueryBuilder().delete().from(RoleAudit).execute();
      console.log(`✅ ${roleAuditCount} registros eliminados de role_audit`);
    } else {
      console.log('ℹ️  No hay registros en role_audit');
    }

    // 4. Limpiar auditoría institucional (opcional - mantener para historial)
    const instAuditRepo = dataSource.getRepository(InstitucionalAudit);
    const instAuditCount = await instAuditRepo.count();
    
    console.log(`ℹ️  Se mantienen ${instAuditCount} registros en institucional_audit para historial`);

    console.log('🎉 Limpieza completada exitosamente');
    console.log('📊 Base de datos lista para nuevo sistema institucional');
    
  } catch (error) {
    console.error('❌ Error durante la limpieza:', error);
    throw error;
  } finally {
    await app.close();
  }
}

cleanExistingData().catch(console.error);