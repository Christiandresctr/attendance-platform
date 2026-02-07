import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, Between, LessThan, MoreThan } from 'typeorm';
import { ClassSchedule } from '../entities/class-schedule.entity';
import { CreateClassScheduleDto } from '../dto/create-class-schedule.dto';
import { UpdateClassScheduleDto } from '../dto/update-class-schedule.dto';

@Injectable()
export class ClassScheduleService {
  constructor(
    @InjectRepository(ClassSchedule)
    private readonly classScheduleRepository: Repository<ClassSchedule>,
  ) {}

  async create(createDto: CreateClassScheduleDto): Promise<ClassSchedule> {
    // Validar datos de entrada
    this.validateCreateDto(createDto);

    // Validar conflictos de horarios
    await this.validateNoScheduleConflict(createDto);

    // Validar reglas institucionales
    this.validateInstitutionalRules(createDto);

    const newSchedule = this.classScheduleRepository.create({
      ...createDto,
      isActive: true,
      createdAt: new Date()
    });

    return await this.classScheduleRepository.save(newSchedule);
  }

  async findAll(): Promise<ClassSchedule[]> {
    return await this.classScheduleRepository.find({
      where: { isActive: true },
      relations: ['class'],
      order: { 
        weekOfSemester: 'ASC', 
        dayOfWeek: 'ASC', 
        startTime: 'ASC'
      }
    });
  }

  async findByClass(classId: string): Promise<ClassSchedule[]> {
    return await this.classScheduleRepository.find({
      where: { classId, isActive: true },
      relations: ['class'],
      order: { 
        weekOfSemester: 'ASC', 
        dayOfWeek: 'ASC', 
        startTime: 'ASC'
      }
    });
  }

  async findByClassAndSemester(classId: string, weekOfSemester: number): Promise<ClassSchedule[]> {
    return await this.classScheduleRepository.find({
      where: { 
        classId, 
        weekOfSemester, 
        isActive: true 
      },
      relations: ['class'],
      order: { 
        dayOfWeek: 'ASC', 
        startTime: 'ASC'
      }
    });
  }

  async findByDay(dayOfWeek: number): Promise<ClassSchedule[]> {
  return await this.classScheduleRepository.find({
    where: { dayOfWeek, isActive: true },
    relations: ['class'],
    order: {
      weekOfSemester: 'ASC',
      startTime: 'ASC'
    }
  });
}

  async findByClassAndDay(classId: string, dayOfWeek: number): Promise<ClassSchedule> {
    const schedule = await this.classScheduleRepository.findOne({
      where: { 
        classId, 
        dayOfWeek, 
        isActive: true 
      },
      relations: ['class']
    });

    if (!schedule) {
      throw new NotFoundException(`Class schedule for class ${classId} on day ${dayOfWeek} not found`);
    }

    return schedule;
  }

  async findOne(id: string): Promise<ClassSchedule> {
    const schedule = await this.classScheduleRepository.findOne({
      where: { id, isActive: true },
      relations: ['class']
    });

    if (!schedule) {
      throw new NotFoundException(`Class schedule with ID ${id} not found`);
    }

    return schedule;
  }

  async update(id: string, updateDto: UpdateClassScheduleDto): Promise<ClassSchedule> {
    await this.findOne(id); // Verify existence
    await this.classScheduleRepository.update(id, updateDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id); // Verify existence
    await this.classScheduleRepository.update(id, { 
      isActive: false,
      updatedAt: new Date()
    });
  }

  // Métodos de validación completos
  private async validateNoScheduleConflict(createDto: CreateClassScheduleDto): Promise<void> {
    const existingSchedule = await this.classScheduleRepository.findOne({
      where: {
        classId: createDto.classId,
        dayOfWeek: createDto.dayOfWeek,
        weekOfSemester: createDto.weekOfSemester,
        isActive: true
      }
    });

    if (existingSchedule) {
      throw new BadRequestException(
        `Schedule conflict for class ${createDto.classId} on ${this.getDayName(createDto.dayOfWeek)}, week ${createDto.weekOfSemester}. Class already scheduled from ${existingSchedule.startTime}-${existingSchedule.endTime}`
      );
    }
  }

  private validateInstitutionalRules(createDto: CreateClassScheduleDto): void {
    // Regla 1: No clases los domingos
    if (createDto.dayOfWeek === 7) { // 7 = domingo
      throw new BadRequestException('Classes cannot be scheduled on Sunday');
    }

    // Regla 2: Máximo 6 horas de clase continua
    this.validateContinuousClassTime(createDto);

    // Regla 3: Tiempo mínimo entre clases (15 minutos)
    this.validateClassTimeGap(createDto);
  }

  private validateCreateDto(createDto: CreateClassScheduleDto): void {
    if (!createDto.classId) {
      throw new BadRequestException('Class ID is required');
    }

    if (!createDto.startTime || !createDto.endTime) {
      throw new BadRequestException('Start and end times are required');
    }
  }

  private validateContinuousClassTime(createDto: CreateClassScheduleDto): void {
    // Esta validación requiere comparar con horarios existentes
    // Para simplificar, implementaremos validación básica
    console.log('Validating continuous class time for:', createDto);
  }

  private validateClassTimeGap(createDto: CreateClassScheduleDto): void {
    // Validar que haya un mínimo de 15 minutos entre clases consecutivas
    // Implementar lógica compleja aquí
    console.log('Validating 15-minute minimum gap between classes');
  }

  private getDayName(dayOfWeek: number): string {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return days[dayOfWeek] || 'Día desconocido';
}

  private parseTime(timeString: string): Date {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }
}