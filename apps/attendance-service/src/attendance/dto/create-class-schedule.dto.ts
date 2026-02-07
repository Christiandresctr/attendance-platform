import { IsEnum, IsString, IsNotEmpty, IsOptional, Length, Max, IsUUID, Matches, IsNumber, IsBoolean } from 'class-validator';
import { DayOfWeek, ScheduleType } from '../entities/class-schedule.entity';

export class CreateClassScheduleDto {
  @IsEnum(DayOfWeek)
  @IsNotEmpty()
  dayOfWeek: DayOfWeek;

  @IsUUID()
  @IsNotEmpty()
  classId: string;

  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Start time must be in HH:MM format'
  })
  startTime: string;

  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'End time must be in HH:MM format'
  })
  endTime: string;

  @IsOptional()
  @IsEnum(ScheduleType)
  scheduleType: ScheduleType;

  @IsOptional()
  @IsString()
  @Length(1, 20)
  room: string;

  @IsOptional()
  @IsNumber()
  @Max(100)
  maxCapacity: number;

  @IsOptional()
  @IsNumber()
  @Max(52)
  weekOfSemester: number;

  @IsOptional()
  @IsBoolean()
  isActive: boolean = true;
}
