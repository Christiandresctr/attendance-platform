import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '@attendance-platform/auth-lib';
import { ClassSchedule } from './class-schedule.entity';
import { ClassEnrollment } from './class-enrollment.entity';
import { AcademicPeriod } from './academic-period.entity';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255 })
  subject: string;

  @Column({ name: 'teacher_id' })
  teacherId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'teacher_id' })
  teacher: User;

  @OneToMany(() => ClassSchedule, schedule => schedule.class)
  @JoinColumn({ name: 'class_id' })
  schedules: ClassSchedule[];

  @OneToMany(() => ClassEnrollment, enrollment => enrollment.class)
  @JoinColumn({ name: 'class_id' })
  enrollments: ClassEnrollment[];

  @Column({ name: 'academic_period_id', nullable: true })
  academicPeriodId: string;

  @ManyToOne(() => AcademicPeriod)
  @JoinColumn({ name: 'academic_period_id' })
  academicPeriod: AcademicPeriod;

  @Column({ name: 'max_capacity', type: 'int', nullable: true })
  maxCapacity: number | null;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}