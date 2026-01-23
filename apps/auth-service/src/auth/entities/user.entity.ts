import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Credential } from './credential.entity';
import { Role } from './role.entity';
import { RoleAudit } from './role-audit.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  name?: string;

  @OneToMany(() => Credential, (credential) => credential.user, { cascade: true })
  credentials!: Credential[];

  @ManyToMany(() => Role, (role) => role.users, { cascade: true })
  @JoinTable({ name: 'user_roles' })
  roles!: Role[];

  @OneToMany(() => RoleAudit, (audit) => audit.user)
  roleAudits!: RoleAudit[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
