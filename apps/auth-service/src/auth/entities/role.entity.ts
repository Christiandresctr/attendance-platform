import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { RoleAudit } from './role-audit.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'integer', default: 10 })
  level!: number;

  @Column({ default: false })
  isSystem!: boolean;

  @Column({ type: 'json', nullable: true })
  permissions?: string[];

  @ManyToMany(() => User, (user) => user.roles)
  users!: User[];

  @OneToMany(() => RoleAudit, (audit) => audit.role)
  roleAudits!: RoleAudit[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;
}
