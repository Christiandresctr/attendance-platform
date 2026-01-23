import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { InstitucionalStudent } from '../src/auth/entities/institucional-student.entity';
import { InstitucionalTeacher } from '../src/auth/entities/institucional-teacher.entity';

async function listAvailableEmails() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  
  try {
    const studentRepo = dataSource.getRepository(InstitucionalStudent);
    const teacherRepo = dataSource.getRepository(InstitucionalTeacher);
    
    const students = await studentRepo.find({ where: { isActive: true } });
    const teachers = await teacherRepo.find({ where: { isActive: true } });
    
    const allEmails = [...students.map(s => s.email), ...teachers.map(t => t.email)];
    const uniqueEmails = [...new Set(allEmails)];
    const duplicates = allEmails.filter((email, index) => allEmails.indexOf(email) !== index);
    
    console.log('\n📧 Available emails for registration:');
    console.log('=====================================');
    
    console.log('\n🎓 Students (first 10):');
    students.slice(0, 10).forEach((student, i) => {
      console.log(`${i + 1}. ${student.email} - ${student.name} (${student.studentId})`);
    });
    
    console.log('\n👨‍🏫 Teachers (all):');
    teachers.forEach((teacher, i) => {
      console.log(`${i + 1}. ${teacher.email} - ${teacher.name} (${teacher.teacherId})`);
    });
    
    if (duplicates.length > 0) {
      console.log('\n❌ Duplicate emails found:');
      [...new Set(duplicates)].forEach(email => {
        console.log(`- ${email}`);
      });
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`Total students: ${students.length}`);
    console.log(`Total teachers: ${teachers.length}`);
    console.log(`Unique emails: ${uniqueEmails.length}`);
    console.log(`Total emails (with duplicates): ${allEmails.length}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await app.close();
  }
}

listAvailableEmails();
