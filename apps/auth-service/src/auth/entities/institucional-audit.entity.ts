import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('institucional_audit')
export class InstitucionalAudit {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  email!: string;

  @Column({
    type: 'varchar',
    length: 30,
  })
  action: 'VALIDATION_SUCCESS' | 'VALIDATION_FAILED' | 'REGISTER_SUCCESS' | 'REGISTER_FAILED' = 'VALIDATION_SUCCESS';

  @Column({ type: 'text', nullable: true })
  details?: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true
  })
  userType?: 'student' | 'teacher' | 'not_found';

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}