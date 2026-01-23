import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('institucional_teachers')
export class InstitucionalTeacher {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  name!: string;

  @Column({ name: 'teacher_id', unique: true })
  teacherId!: string;

  @Column()
  identification!: string;

  @Column()
  faculty!: string;

  @Column()
  department!: string;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}