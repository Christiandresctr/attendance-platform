import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InstitucionalStudent } from '../entities/institucional-student.entity';
import { InstitucionalTeacher } from '../entities/institucional-teacher.entity';
import { InstitucionalAudit } from '../entities/institucional-audit.entity';

@Injectable()
export class InstitucionalService {
  constructor(
    @InjectRepository(InstitucionalStudent)
    private readonly studentRepo: Repository<InstitucionalStudent>,
    @InjectRepository(InstitucionalTeacher)
    private readonly teacherRepo: Repository<InstitucionalTeacher>,
    @InjectRepository(InstitucionalAudit)
    private readonly auditRepo: Repository<InstitucionalAudit>,
  ) {}

  /**
   * Valida si un email existe en la base de datos institucional
   */
  async validateEmail(email: string): Promise<{
    isValid: boolean;
    userType: 'student' | 'teacher' | 'not_found';
    userData?: InstitucionalStudent | InstitucionalTeacher;
  }> {
    // Primero buscar en estudiantes
    const student = await this.studentRepo.findOne({
      where: { email, isActive: true }
    });

    if (student) {
      await this.createAudit(email, 'VALIDATION_SUCCESS', 'Email validado como estudiante', 'student');
      return {
        isValid: true,
        userType: 'student',
        userData: student
      };
    }

    // Luego buscar en profesores
    const teacher = await this.teacherRepo.findOne({
      where: { email, isActive: true }
    });

    if (teacher) {
      await this.createAudit(email, 'VALIDATION_SUCCESS', 'Email validado como profesor', 'teacher');
      return {
        isValid: true,
        userType: 'teacher',
        userData: teacher
      };
    }

    // No se encontró en ninguna tabla
    await this.createAudit(email, 'VALIDATION_FAILED', 'Email no encontrado en registros institucionales', 'not_found');
    return {
      isValid: false,
      userType: 'not_found'
    };
  }

  /**
   * Busca estudiante por email
   */
  async getStudentByEmail(email: string): Promise<InstitucionalStudent | null> {
    return this.studentRepo.findOne({
      where: { email, isActive: true }
    });
  }

  /**
   * Busca profesor por email
   */
  async getTeacherByEmail(email: string): Promise<InstitucionalTeacher | null> {
    return this.teacherRepo.findOne({
      where: { email, isActive: true }
    });
  }

  // ==================== CRUD ESTUDIANTES ====================

  /**
   * Obtiene todos los estudiantes
   */
  async getAllStudents(): Promise<InstitucionalStudent[]> {
    return this.studentRepo.find({
      where: { isActive: true },
      order: { studentId: 'ASC' }
    });
  }

  /**
   * Obtiene estudiante por ID
   */
  async getStudentById(id: string): Promise<InstitucionalStudent> {
    const student = await this.studentRepo.findOne({
      where: { id, isActive: true }
    });

    if (!student) {
      throw new NotFoundException(`Estudiante con ID ${id} no encontrado`);
    }

    return student;
  }

  /**
   * Crea nuevo estudiante
   */
  async createStudent(createStudentDto: {
    email: string;
    name: string;
    studentId: string;
    identification: string;
    faculty?: string;
    career?: string;
  }): Promise<InstitucionalStudent> {
    // Verificar si ya existe el email
    const existingEmail = await this.studentRepo.findOne({
      where: { email: createStudentDto.email }
    });

    if (existingEmail) {
      throw new NotFoundException(`Email ${createStudentDto.email} ya está registrado`);
    }

    // Verificar si ya existe el ID de estudiante
    const existingId = await this.studentRepo.findOne({
      where: { studentId: createStudentDto.studentId }
    });

    if (existingId) {
      throw new NotFoundException(`ID de estudiante ${createStudentDto.studentId} ya está registrado`);
    }

    const student = this.studentRepo.create({
      ...createStudentDto,
      faculty: createStudentDto.faculty || 'Facultad de Ingeniería y Ciencias Exactas',
      career: createStudentDto.career || 'Ingeniería en Sistemas',
      isActive: true
    });

    return this.studentRepo.save(student);
  }

  /**
   * Actualiza estudiante existente
   */
  async updateStudent(id: string, updateStudentDto: {
    email?: string;
    name?: string;
    identification?: string;
    faculty?: string;
    career?: string;
    isActive?: boolean;
  }): Promise<InstitucionalStudent> {
    const student = await this.getStudentById(id);

    // Si se actualiza el email, verificar que no exista
    if (updateStudentDto.email && updateStudentDto.email !== student.email) {
      const existingEmail = await this.studentRepo.findOne({
        where: { email: updateStudentDto.email }
      });

      if (existingEmail) {
        throw new NotFoundException(`Email ${updateStudentDto.email} ya está registrado`);
      }
    }

    Object.assign(student, updateStudentDto);
    return this.studentRepo.save(student);
  }

  /**
   * Elimina estudiante (soft delete)
   */
  async deleteStudent(id: string): Promise<void> {
    const student = await this.getStudentById(id);
    student.isActive = false;
    await this.studentRepo.save(student);
  }

  // ==================== CRUD PROFESORES ====================

  /**
   * Obtiene todos los profesores
   */
  async getAllTeachers(): Promise<InstitucionalTeacher[]> {
    return this.teacherRepo.find({
      where: { isActive: true },
      order: { teacherId: 'ASC' }
    });
  }

  /**
   * Obtiene profesor por ID
   */
  async getTeacherById(id: string): Promise<InstitucionalTeacher> {
    const teacher = await this.teacherRepo.findOne({
      where: { id, isActive: true }
    });

    if (!teacher) {
      throw new NotFoundException(`Profesor con ID ${id} no encontrado`);
    }

    return teacher;
  }

  /**
   * Crea nuevo profesor
   */
  async createTeacher(createTeacherDto: {
    email: string;
    name: string;
    teacherId: string;
    identification: string;
    faculty?: string;
    department?: string;
  }): Promise<InstitucionalTeacher> {
    // Verificar si ya existe el email
    const existingEmail = await this.teacherRepo.findOne({
      where: { email: createTeacherDto.email }
    });

    if (existingEmail) {
      throw new NotFoundException(`Email ${createTeacherDto.email} ya está registrado`);
    }

    // Verificar si ya existe el ID de profesor
    const existingId = await this.teacherRepo.findOne({
      where: { teacherId: createTeacherDto.teacherId }
    });

    if (existingId) {
      throw new NotFoundException(`ID de profesor ${createTeacherDto.teacherId} ya está registrado`);
    }

    const teacher = this.teacherRepo.create({
      ...createTeacherDto,
      faculty: createTeacherDto.faculty || 'Facultad de Ingeniería y Ciencias Exactas',
      department: createTeacherDto.department || 'Departamento de Ingeniería en Sistemas',
      isActive: true
    });

    return this.teacherRepo.save(teacher);
  }

  /**
   * Actualiza profesor existente
   */
  async updateTeacher(id: string, updateTeacherDto: {
    email?: string;
    name?: string;
    identification?: string;
    faculty?: string;
    department?: string;
    isActive?: boolean;
  }): Promise<InstitucionalTeacher> {
    const teacher = await this.getTeacherById(id);

    // Si se actualiza el email, verificar que no exista
    if (updateTeacherDto.email && updateTeacherDto.email !== teacher.email) {
      const existingEmail = await this.teacherRepo.findOne({
        where: { email: updateTeacherDto.email }
      });

      if (existingEmail) {
        throw new NotFoundException(`Email ${updateTeacherDto.email} ya está registrado`);
      }
    }

    Object.assign(teacher, updateTeacherDto);
    return this.teacherRepo.save(teacher);
  }

  /**
   * Elimina profesor (soft delete)
   */
  async deleteTeacher(id: string): Promise<void> {
    const teacher = await this.getTeacherById(id);
    teacher.isActive = false;
    await this.teacherRepo.save(teacher);
  }

  // ==================== AUDITORÍA ====================

  /**
   * Crea registro de auditoría
   */
  private async createAudit(
    email: string,
    action: 'VALIDATION_SUCCESS' | 'VALIDATION_FAILED' | 'REGISTER_SUCCESS' | 'REGISTER_FAILED',
    details: string,
    userType?: 'student' | 'teacher' | 'not_found'
  ): Promise<void> {
    const audit = this.auditRepo.create({
      email,
      action,
      details,
      userType
    });

    await this.auditRepo.save(audit);
  }

  /**
   * Obtiene todos los registros de auditoría
   */
  async getAuditLogs(limit: number = 100): Promise<InstitucionalAudit[]> {
    return this.auditRepo.find({
      order: { createdAt: 'DESC' },
      take: limit
    });
  }
}