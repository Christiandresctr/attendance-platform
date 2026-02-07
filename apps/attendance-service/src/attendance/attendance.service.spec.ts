import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceService } from './attendance.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { ClassSchedule } from './entities/class-schedule.entity';
import { ClassEnrollment } from './entities/class-enrollment.entity';
import { AcademicPeriod } from './entities/academic-period.entity';

describe('AttendanceService', () => {
  let service: AttendanceService;

  const mockAttendanceRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockClassScheduleRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockClassEnrollmentRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockAcademicPeriodRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendanceService,
        { provide: getRepositoryToken(Attendance), useValue: mockAttendanceRepository },
        { provide: getRepositoryToken(ClassSchedule), useValue: mockClassScheduleRepository },
        { provide: getRepositoryToken(ClassEnrollment), useValue: mockClassEnrollmentRepository },
        { provide: getRepositoryToken(AcademicPeriod), useValue: mockAcademicPeriodRepository },
      ],
    }).compile();

    service = module.get<AttendanceService>(AttendanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
