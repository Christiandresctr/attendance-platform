import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { User } from '../src/auth/entities/user.entity';
import { Role } from '../src/auth/entities/role.entity';

async function checkExistingUsers() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  
  try {
    const userRepo = dataSource.getRepository(User);
    const roleRepo = dataSource.getRepository(Role);
    
    const users = await userRepo.find({ relations: ['roles'] });
    const roles = await roleRepo.find();
    
    console.log('\n👥 Existing registered users:');
    console.log('=============================');
    
    if (users.length === 0) {
      console.log('❌ No registered users found');
    } else {
      users.forEach((user, i) => {
        const roleNames = user.roles?.map(r => r.name).join(', ') || 'No roles';
        console.log(`${i + 1}. ${user.email} - ${user.name} (${roleNames})`);
      });
    }
    
    console.log('\n🏷️ Available roles:');
    console.log('====================');
    roles.forEach((role, i) => {
      console.log(`${i + 1}. ${role.name} (Level: ${role.level}) - ${role.description || 'No description'}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await app.close();
  }
}

checkExistingUsers();
