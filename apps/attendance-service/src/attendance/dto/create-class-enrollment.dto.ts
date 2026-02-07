import { IsUUID, IsNotEmpty, IsOptional, IsDate } from 'class-validator';

export class CreateClassEnrollmentDto {
  @IsUUID()
  @IsNotEmpty()
  classId: string;

  @IsUUID()
  @IsNotEmpty()
  studentId: string;

  @IsUUID()
  @IsNotEmpty()
  academicPeriodId: string;

  @IsOptional()
  @IsDate()
  enrollmentDate: Date = new Date();
}