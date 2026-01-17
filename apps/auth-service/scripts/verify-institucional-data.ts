import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { InstitucionalStudent } from '../src/auth/entities/institucional-student.entity';
import { InstitucionalTeacher } from '../src/auth/entities/institucional-teacher.entity';
import { InstitucionalAudit } from '../src/auth/entities/institucional-audit.entity';

async function verifyInstitucionalData() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  console.log('🔍 Iniciando verificación de datos institucionales...');

  try {
    const studentRepo = dataSource.getRepository(InstitucionalStudent);
    const teacherRepo = dataSource.getRepository(InstitucionalTeacher);
    const auditRepo = dataSource.getRepository(InstitucionalAudit);

    // Verificar estudiantes
    const students = await studentRepo.find({ where: { isActive: true } });
    console.log(`\n📊 Total estudiantes encontrados: ${students.length}`);
    
    if (students.length === 0) {
      console.log('❌ No se encontraron estudiantes activos');
    } else {
      console.log('✅ Estudiantes verificados');
      
      // Verificar formato de emails
      const invalidStudentEmails = students.filter(s => !s.email.endsWith('@uce.edu.ec'));
      if (invalidStudentEmails.length > 0) {
        console.log(`❌ ${invalidStudentEmails.length} estudiantes con email inválido (no @uce.edu.ec)`);
      } else {
        console.log('✅ Todos los emails de estudiantes tienen formato @uce.edu.ec');
      }
      
      // Verificar IDs secuenciales
      const studentIds = students.map(s => s.studentId).sort();
      const expectedStudentIds = Array.from({ length: students.length }, (_, i) => `STD-${String(i + 1).padStart(3, '0')}`);
      const correctStudentIds = studentIds.every((id, index) => id === expectedStudentIds[index]);
      
      if (correctStudentIds) {
        console.log('✅ IDs de estudiantes secuenciales y correctos');
      } else {
        console.log('❌ IDs de estudiantes no secuenciales');
      }
    }

    // Verificar profesores
    const teachers = await teacherRepo.find({ where: { isActive: true } });
    console.log(`\n📊 Total profesores encontrados: ${teachers.length}`);
    
    if (teachers.length === 0) {
      console.log('❌ No se encontraron profesores activos');
    } else {
      console.log('✅ Profesores verificados');
      
      // Verificar formato de emails
      const invalidTeacherEmails = teachers.filter(t => !t.email.endsWith('@uce.edu.ec'));
      if (invalidTeacherEmails.length > 0) {
        console.log(`❌ ${invalidTeacherEmails.length} profesores con email inválido (no @uce.edu.ec)`);
      } else {
        console.log('✅ Todos los emails de profesores tienen formato @uce.edu.ec');
      }
      
      // Verificar IDs secuenciales
      const teacherIds = teachers.map(t => t.teacherId).sort();
      const expectedTeacherIds = Array.from({ length: teachers.length }, (_, i) => `DOC-${String(i + 1).padStart(3, '0')}`);
      const correctTeacherIds = teacherIds.every((id, index) => id === expectedTeacherIds[index]);
      
      if (correctTeacherIds) {
        console.log('✅ IDs de profesores secuenciales y correctos');
      } else {
        console.log('❌ IDs de profesores no secuenciales');
      }
    }

    // Verificar auditoría
    const auditLogs = await auditRepo.find({ 
      order: { createdAt: 'DESC' },
      take: 5
    });
    
    console.log(`\n📊 Total logs de auditoría: ${await auditRepo.count()}`);
    if (auditLogs.length > 0) {
      console.log('✅ Logs de auditoría encontrados');
      console.log('📋 Últimos 5 logs:');
      auditLogs.forEach((log, index) => {
        console.log(`${index + 1}. ${log.action} - ${log.email} (${log.createdAt.toLocaleString()})`);
      });
    } else {
      console.log('ℹ️  No hay logs de auditoría');
    }

    // Verificar duplicados
    const allStudentEmails = students.map(s => s.email);
    const allTeacherEmails = teachers.map(t => t.email);
    const allEmails = [...allStudentEmails, ...allTeacherEmails];
    
    const uniqueEmails = new Set(allEmails);
    if (uniqueEmails.size !== allEmails.length) {
      console.log('❌ Se encontraron emails duplicados');
    } else {
      console.log('✅ No hay emails duplicados');
    }

    // Resumen final
    console.log('\n📋 RESUMEN DE VERIFICACIÓN:');
    console.log(`🎓 Estudiantes: ${students.length} (esperado: 60)`);
    console.log(`👨‍🏫 Profesores: ${teachers.length} (esperado: 10)`);
    console.log(`📧 Total emails: ${allEmails.length} (esperado: 70)`);
    console.log(`✅ Formato @uce.edu.ec: ${uniqueEmails.size === allEmails.length ? 'Correcto' : 'Error'}`);
    
    const isVerificationSuccessful = 
      students.length === 60 && 
      teachers.length === 10 && 
      uniqueEmails.size === allEmails.length;
    
    if (isVerificationSuccessful) {
      console.log('\n🎉 VERIFICACIÓN COMPLETADA EXITOSAMENTE');
      console.log('✅ Sistema institucional listo para uso');
    } else {
      console.log('\n⚠️  VERIFICACIÓN COMPLETADA CON ERRORES');
      console.log('❌ Revisar los problemas indicados arriba');
    }
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
    throw error;
  } finally {
    await app.close();
  }
}

verifyInstitucionalData().catch(console.error);