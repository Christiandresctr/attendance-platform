import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { InstitucionalStudent } from '../src/auth/entities/institucional-student.entity';
import { InstitucionalTeacher } from '../src/auth/entities/institucional-teacher.entity';

function generateInstitucionalEmail(fullName: string, lastName: string): string {
  // "Christian Andres Maisincho Palaguaray" -> "ca" + "maisincho" -> "camaisincho"
  const nameParts = fullName.split(' ');
  const firstInitial = nameParts[0][0].toLowerCase();
  const secondInitial = nameParts.length > 1 ? nameParts[1][0].toLowerCase() : '';
  const lastNameMain = lastName.split(' ')[0].toLowerCase();
  return `${firstInitial}${secondInitial}${lastNameMain}@uce.edu.ec`;
}

function generateRandomDate(daysAgo: number = 30): Date {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date;
}

function generateRandomCedula(base: number): string {
  return `171234567${base}`;
}

async function seedInstitucionalData() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);

  console.log('🌱 Iniciando generación de datos institucionales...');

  try {
    // Datos base para estudiantes
    const studentFirstNames = [
      'Christian Andres', 'Maria Isabel', 'Luis Fernando', 'Ana Maria', 'Carlos Alberto',
      'Patricia Alexandra', 'Diego Andres', 'Gabriela Maria', 'Roberto Andres', 'Catherine Alexandra',
      'Eduardo Jose', 'Sofia Carolina', 'Andres Felipe', 'Valeria Alejandra', 'Nicolas Mauricio',
      'Daniela Beatriz', 'Sebastian David', 'Camila Andrea', 'Javier Ignacio', 'Lucia Victoria',
      'Martín Gabriel', 'Paulina Daniela', 'Ricardo Antonio', 'Isabella Fernanda', 'Mateo Sebastian',
      'Victoria Eugenia', 'Felipe Andres', 'Rebecca Sophia', 'Lucas Alejandro', 'Emilia Valentina',
      'Bruno Benjamin', 'Olivia Isabella', 'Leonardo Santiago', 'Emma Grace', 'Alexander Thomas',
      'Sophia Marie', 'Daniel James', 'Mia Rose', 'Ethan Michael', 'Charlotte Grace',
      'William John', 'Amelia Jane', 'James Robert', 'Harper Lee', 'Benjamin Joseph',
      'Evelyn Claire', 'Lucas Henry', 'Isabella Fernanda', 'Alexander Thomas', 'Sophia Marie',
      'Emma Grace', 'William John', 'Amelia Jane', 'Isabella Fernanda'
    ];

    const studentLastNames = [
      'Maisincho', 'Martinez', 'Rojas', 'Torres', 'Flores', 'Mendoza', 'Perez', 'Sanchez',
      'Vargas', 'Morales', 'Castro', 'Reyes', 'Molina', 'Gonzalez', 'Ruiz', 'Lopez',
      'Silva', 'Campos', 'Soto', 'Marin', 'Diaz', 'Fuentes', 'Cortes', 'Alvarez',
      'Romero', 'Gutierrez', 'Herrera', 'Mendoza', 'Gil', 'Santos', 'Cruz', 'Navarro',
      'Jimenez', 'Muñoz', 'Dominguez', 'Ortega', 'Rubio', 'Iglesias', 'Ferrer', 'Cabrera'
    ];

    // Datos base para profesores
    const teacherFirstNames = [
      'Roberto Dario', 'Maria Cristina', 'Jose Andres', 'Patricia Elizabeth', 'Carlos Alberto',
      'Luis Fernando', 'Ana Gabriela', 'Diego Alejandro', 'Roberto Carlos', 'Catherine Maria'
    ];

    const teacherLastNames = [
      'Martinez Noguera', 'Perez Alvarez', 'Sanchez Mora', 'Vargas Lopez', 'Mendoza Salas',
      'Rojas Torres', 'Torres Flores', 'Morales Castro', 'Perez Mendez', 'Flores Sanchez'
    ];

    const studentRepo = dataSource.getRepository(InstitucionalStudent);
    const teacherRepo = dataSource.getRepository(InstitucionalTeacher);

    // Limpiar datos existentes (si los hay)
    await studentRepo.createQueryBuilder().delete().from(InstitucionalStudent).execute();
    await teacherRepo.createQueryBuilder().delete().from(InstitucionalTeacher).execute();
    console.log('🧹 Datos institucionales existentes eliminados');

    // Generar 60 estudiantes de uno en uno
    console.log('👨‍🎓 Generando 60 estudiantes...');
    let studentsCreados = 0;
    
    for (let i = 0; i < 60; i++) {
      const firstName = studentFirstNames[i % studentFirstNames.length];
      const lastName = studentLastNames[i % studentLastNames.length];
      const email = generateInstitucionalEmail(firstName, lastName);
      const studentId = `STD-${String(i + 1).padStart(3, '0')}`;
      
      const student = studentRepo.create({
        email,
        name: `${firstName} ${lastName}`,
        studentId,
        identification: generateRandomCedula(i + 1),
        faculty: 'Facultad de Ingeniería y Ciencias Exactas',
        career: 'Ingeniería en Sistemas',
        isActive: true,
        createdAt: generateRandomDate(30)
      });
      
      try {
        await studentRepo.save(student);
        studentsCreados++;
        console.log(`✅ Estudiante ${i + 1}/60: ${student.email} (${student.studentId})`);
      } catch (error) {
        console.log(`❌ Error al crear estudiante ${i + 1}:`, error.message);
      }
    }

    // Generar 10 profesores de uno en uno
    console.log('👨‍🏫 Generando 10 profesores...');
    let teachersCreados = 0;
    
    for (let i = 0; i < 10; i++) {
      const firstName = teacherFirstNames[i];
      const lastName = teacherLastNames[i];
      const email = generateInstitucionalEmail(firstName, lastName);
      const teacherId = `DOC-${String(i + 1).padStart(3, '0')}`;
      
      const teacher = teacherRepo.create({
        email,
        name: `${firstName} ${lastName}`,
        teacherId,
        identification: generateRandomCedula(i + 100),
        faculty: 'Facultad de Ingeniería y Ciencias Exactas',
        department: 'Departamento de Ingeniería en Sistemas',
        isActive: true,
        createdAt: generateRandomDate(30)
      });
      
      try {
        await teacherRepo.save(teacher);
        teachersCreados++;
        console.log(`✅ Profesor ${i + 1}/10: ${teacher.email} (${teacher.teacherId})`);
      } catch (error) {
        console.log(`❌ Error al crear profesor ${i + 1}:`, error.message);
      }
    }

    // Mostrar ejemplos generados
    console.log('\n📋 Ejemplos de estudiantes generados:');
    
    // Mostrar ejemplos de profesores generados
    console.log('\n🎉 Generación de datos institucionales completada exitosamente');
    console.log('📊 Total: 60 estudiantes + 10 profesores');
    console.log('🏛️  Facultad: Facultad de Ingeniería y Ciencias Exactas');
    console.log('🎓 Carrera: Ingeniería en Sistemas');
    
  } catch (error) {
    console.error('❌ Error durante la generación de datos:', error);
    throw error;
  } finally {
    await app.close();
  }
}

seedInstitucionalData().catch(console.error);