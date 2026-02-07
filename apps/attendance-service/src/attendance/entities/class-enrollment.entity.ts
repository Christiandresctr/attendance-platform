import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '@attendance-platform/auth-lib';
import { Class } from './class.entity';
import { AcademicPeriod } from './academic-period.entity';

export enum EnrollmentStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING = 'PENDING',
}

@Entity('class_enrollments')
export class ClassEnrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'student_id' })
  studentId: string;

  @Column({ name: 'class_id' })
  classId: string;

  @Column({ name: 'academic_period_id' })
  academicPeriodId: string;

  @Column({ 
    type: 'enum', 
    default: EnrollmentStatus.ACTIVE 
  })
  status: EnrollmentStatus;

  @Column({ type: 'date', name: 'enrollment_date' })
  enrollmentDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'student_id' })
  student: User;

  @ManyToOne(() => Class)
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @ManyToOne(() => AcademicPeriod)
  @JoinColumn({ name: 'academic_period_id' })
  academicPeriod: AcademicPeriod;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
