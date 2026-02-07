import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClassEnrollment, EnrollmentStatus } from '../entities/class-enrollment.entity';
import { Class } from '../entities/class.entity';
import { AcademicPeriod, AcademicStatus } from '../entities/academic-period.entity';
import { CreateClassEnrollmentDto } from '../dto/create-class-enrollment.dto';
import { UpdateClassEnrollmentDto } from '../dto/update-class-enrollment.dto';

@Injectable()
export class ClassEnrollmentService {
  constructor(
    @InjectRepository(ClassEnrollment)
    private readonly classEnrollmentRepository: Repository<ClassEnrollment>,
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
    @InjectRepository(AcademicPeriod)
    private readonly academicPeriodRepository: Repository<AcademicPeriod>,
  ) {}

  async create(createDto: CreateClassEnrollmentDto): Promise<ClassEnrollment> {
    // Validar que exista matrícula activa
    const existing = await this.classEnrollmentRepository.findOne({
      where: {
        studentId: createDto.studentId,
        classId: createDto.classId,
        academicPeriodId: createDto.academicPeriodId,
        isActive: true
      }
    });

    if (existing) {
      throw new BadRequestException(`Student is already enrolled in class ${createDto.classId}`);
    }

    // Validar que la clase exista y esté activa
    const classEntity = await this.classRepository.findOne({
      where: { id: createDto.classId, isActive: true }
    });

    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${createDto.classId} not found or is inactive`);
    }

    // Validar que el período académico esté activo
    const academicPeriod = await this.academicPeriodRepository.findOne({
      where: { 
        id: createDto.academicPeriodId,
        status: AcademicStatus.ACTIVE,
        isActive: true
      }
    });

    if (!academicPeriod) {
      throw new BadRequestException(`Academic period ${createDto.academicPeriodId} is not active`);
    }

    // Validar capacidad máxima de la clase
    if (classEntity.maxCapacity) {
      const enrollmentsCount = await this.classEnrollmentRepository.count({
        where: { 
          classId: createDto.classId, 
          isActive: true 
        }
      });
      
      if (enrollmentsCount >= classEntity.maxCapacity) {
        throw new BadRequestException(`Class ${createDto.classId} has reached maximum capacity`);
      }
    }

    const enrollment = this.classEnrollmentRepository.create({
      ...createDto,
      status: EnrollmentStatus.ACTIVE,
      enrollmentDate: createDto.enrollmentDate || new Date(),
      isActive: true
    });

    return await this.classEnrollmentRepository.save(enrollment);
  }

  async findByStudent(studentId: string): Promise<ClassEnrollment[]> {
    return await this.classEnrollmentRepository.find({
      where: { 
        studentId, 
        isActive: true 
      },
      relations: ['class', 'academicPeriod', 'student'],
      order: { enrollmentDate: 'DESC' }
    });
  }

  async findByClass(classId: string): Promise<ClassEnrollment[]> {
    return await this.classEnrollmentRepository.find({
      where: { 
        classId, 
        isActive: true 
      },
      relations: ['class', 'academicPeriod', 'student'],
      order: { enrollmentDate: 'ASC' }
    });
  }

  async findOne(id: string): Promise<ClassEnrollment> {
    const enrollment = await this.classEnrollmentRepository.findOne({
      where: { id },
      relations: ['class', 'academicPeriod', 'student']
    });

    if (!enrollment) {
      throw new NotFoundException(`Class enrollment with ID ${id} not found`);
    }

    return enrollment;
  }

  async update(id: string, updateDto: UpdateClassEnrollmentDto): Promise<ClassEnrollment> {
    await this.findOne(id);
    await this.classEnrollmentRepository.update(id, updateDto);
    return this.findOne(id);
  }

  async cancel(id: string): Promise<void> {
    await this.findOne(id);
    await this.classEnrollmentRepository.update(id, { 
      status: EnrollmentStatus.INACTIVE,
      isActive: false
    });
  }

  async reactivate(id: string): Promise<void> {
    await this.findOne(id);
    await this.classEnrollmentRepository.update(id, { 
      status: EnrollmentStatus.ACTIVE,
      isActive: true
    });
  }

  async getEnrollmentStats(classId: string): Promise<{
    totalEnrolled: number;
    activeEnrollments: number;
    capacity: number;
    availableSlots: number;
  }> {
    const classInfo = await this.classRepository.findOne({ 
      where: { id: classId, isActive: true } 
    });

    if (!classInfo) {
      throw new NotFoundException(`Class with ID ${classId} not found`);
    }

    const enrollments = await this.classEnrollmentRepository.find({ 
      where: { 
        classId, 
        isActive: true 
      }
    });

    const totalEnrolled = enrollments.length;
    const capacity = classInfo.maxCapacity || 0;
    const availableSlots = capacity - totalEnrolled;

    return {
      totalEnrolled,
      activeEnrollments: totalEnrolled,
      capacity,
      availableSlots
    };
  }
}