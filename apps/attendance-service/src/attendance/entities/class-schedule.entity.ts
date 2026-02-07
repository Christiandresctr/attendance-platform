import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import { Class } from './class.entity';

export enum DayOfWeek {
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
  SUNDAY = 7,
}

export enum ScheduleType {
  REGULAR = 'REGULAR',
  EXAM = 'EXAM',
  SPECIAL_EVENT = 'SPECIAL_EVENT',
  MAKEUP_CLASS = 'MAKEUP_CLASS',
}

@Entity('class_schedules')
export class ClassSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'class_id' })
  classId: string;

  @Column({ name: 'week_of_semester' })
  weekOfSemester: number;

  @Column({ name: 'day_of_week', type: 'int' })
  dayOfWeek: DayOfWeek;

  @Column({ name: 'start_time' })
  startTime: string; // Formato: "HH:MM"

  @Column({ name: 'end_time' })
  endTime: string; // Formato: "HH:MM"

  @Column({ 
    type: 'enum', 
    default: ScheduleType.REGULAR 
  })
  scheduleType: ScheduleType;

  @Column({ type: 'varchar', length: 20, nullable: true })
  room: string;

  @Column({ name: 'max_capacity', type: 'int', default: 40 })
  maxCapacity: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Class)
  @JoinColumn({ name: 'class_id' })
  class: Class;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}