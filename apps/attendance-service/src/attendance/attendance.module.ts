import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { Class } from './entities/class.entity';
import { ClassSchedule } from './entities/class-schedule.entity';
import { ClassEnrollment } from './entities/class-enrollment.entity';
import { AcademicPeriod } from './entities/academic-period.entity';
import { User } from '@attendance-platform/auth-lib';
import { AttendanceService } from './attendance.service';
import { ClassScheduleService } from './services/class-schedule.service';
import { ClassEnrollmentService } from './services/class-enrollment.service';
import { AcademicPeriodService } from './services/academic-period.service';
import { AttendanceController } from './attendance.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Attendance,
      Class,
      ClassSchedule,
      ClassEnrollment,
      AcademicPeriod,
      User
    ]),
  ],
  providers: [
    AttendanceService,
    ClassScheduleService,
    ClassEnrollmentService,
    AcademicPeriodService
  ],
  controllers: [
    AttendanceController
  ],
})
export class AttendanceModule {}