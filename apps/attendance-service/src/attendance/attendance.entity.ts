import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  classId: string;

  @Column()
  date: string;

  @Column()
  time: string;

  @Column()
  status: string;
}
