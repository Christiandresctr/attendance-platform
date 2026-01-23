import { IsEnum, IsOptional } from 'class-validator';
import { AttendanceStatus } from '../entities/attendance.entity';

export class UpdateAttendanceDto {
  @IsOptional()
  @IsEnum(AttendanceStatus, {
    message: 'status must be PRESENT, LATE or ABSENT',
  })
  status?: AttendanceStatus;
}
