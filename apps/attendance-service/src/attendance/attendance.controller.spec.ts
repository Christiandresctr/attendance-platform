import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';

describe('AttendanceController', () => {
  let controller: AttendanceController;

  const mockAttendanceService = {
    markAttendance: jest.fn(),
    getAttendanceRecords: jest.fn(),
    getAttendanceByStudent: jest.fn(),
    getAttendanceByClass: jest.fn(),
    updateAttendanceStatus: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendanceController],
      providers: [
        {
          provide: AttendanceService,
          useValue: mockAttendanceService,
        },
      ],
    })
      .overrideGuard(require('../security/roles.guard').RolesGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(require('@nestjs/passport').AuthGuard('jwt'))
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AttendanceController>(AttendanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
