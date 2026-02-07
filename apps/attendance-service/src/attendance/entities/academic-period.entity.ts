import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ClassEnrollment } from './class-enrollment.entity';
import { Class } from './class.entity';

export enum AcademicStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  UPCOMING = 'UPCOMING',
}

@Entity('academic_periods')
export class AcademicPeriod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 100 })
  name: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({ 
    type: 'enum', 
    default: AcademicStatus.ACTIVE 
  })
  status: AcademicStatus;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => ClassEnrollment, enrollment => enrollment.academicPeriod)
  enrollments: ClassEnrollment[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
