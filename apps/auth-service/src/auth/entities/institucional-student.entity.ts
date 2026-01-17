import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('institucional_students')
export class InstitucionalStudent {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ name: 'student_id', unique: true })
  studentId: string;

  @Column()
  identification: string;

  @Column()
  faculty: string;

  @Column()
  career: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}