import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Role } from './role.entity';

@Entity('role_audit')
export class RoleAudit {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, user => user.roleAudits)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'uuid' })
  roleId!: string;

  @ManyToOne(() => Role, role => role.roleAudits)
  @JoinColumn({ name: 'role_id' })
  role!: Role;

  @Column({
    type: 'varchar',
    length: 20,
  default: 'CREATED'
  })
  action: 'CREATED' | 'ASSIGNED' | 'REMOVED' | 'UPDATED' = 'CREATED';
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @Column({ nullable: true })
  changedBy?: string;

  @Column({ type: 'jsonb', nullable: true })
  oldValues?: any;

  @Column({ type: 'jsonb', nullable: true })
  newValues?: any;
}