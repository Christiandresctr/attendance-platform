import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { AcademicPeriod, AcademicStatus } from '../entities/academic-period.entity';
import { CreateAcademicPeriodDto } from '../dto/create-academic-period.dto';
import { UpdateAcademicPeriodDto } from '../dto/update-academic-period.dto';

@Injectable()
export class AcademicPeriodService {
  constructor(
    @InjectRepository(AcademicPeriod)
    private readonly academicPeriodRepository: Repository<AcademicPeriod>,
  ) {}

  async create(createDto: CreateAcademicPeriodDto): Promise<AcademicPeriod> {
    // Validar que no exista período con mismo nombre
    const existing = await this.academicPeriodRepository.findOne({
      where: { 
        name: createDto.name,
        status: AcademicStatus.ACTIVE,
        endDate: MoreThan(createDto.startDate)
      }
    });

    if (existing) {
      throw new BadRequestException('Academic period already exists or conflicts with existing period');
    }

    // Validar duración mínima (30 días) y máxima (180 días)
    const duration = this.calculateDuration(createDto.startDate, createDto.endDate);
    if (duration < 30 || duration > 180) {
      throw new BadRequestException('Academic period must be between 30 and 180 days');
    }

    const academicPeriod = this.academicPeriodRepository.create({
      ...createDto,
      status: AcademicStatus.ACTIVE,
    });

    return await this.academicPeriodRepository.save(academicPeriod);
  }

  async findAll(): Promise<AcademicPeriod[]> {
    return await this.academicPeriodRepository.find({
      order: { startDate: 'DESC' }
    });
  }

  async findActive(): Promise<AcademicPeriod | null> {
    return await this.academicPeriodRepository.findOne({
      where: { 
        status: AcademicStatus.ACTIVE,
        isActive: true 
      },
      order: { startDate: 'DESC' }
    });
  }

  async findOne(id: string): Promise<AcademicPeriod> {
    const academicPeriod = await this.academicPeriodRepository.findOne({
      where: { id, isActive: true }
    });

    if (!academicPeriod) {
      throw new NotFoundException(`Academic period with ID ${id} not found`);
    }

    return academicPeriod;
  }

  async update(id: string, updateDto: UpdateAcademicPeriodDto): Promise<AcademicPeriod> {
    await this.academicPeriodRepository.update(id, updateDto);
    return this.findOne(id);
  }

  async deactivate(id: string): Promise<void> {
    await this.academicPeriodRepository.update(id, { 
      status: AcademicStatus.INACTIVE,
      isActive: false
    });
  }

  async activate(id: string): Promise<void> {
    await this.academicPeriodRepository.update(id, { 
      status: AcademicStatus.ACTIVE,
      isActive: true
    });
  }

  private calculateDuration(startDate: Date, endDate: Date): number {
    const timeDiff = endDate.getTime() - startDate.getTime();
    const dayDiff = timeDiff / (1000 * 60 * 24);
    return Math.ceil(dayDiff);
  }
}