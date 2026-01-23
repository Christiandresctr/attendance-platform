import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;                    // Código único de clase

  @Column()
  name: string;                   // Nombre de la materia

  @Column()
  subject: string;                // Materia

  @Column()
  teacherId: string;               // FK a users.id

  @Column({ default: true })
  isActive: boolean;               // Clase activa

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}