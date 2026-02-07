import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    })
      .overrideGuard(require('./security/roles.guard').RolesGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(require('@nestjs/passport').AuthGuard('jwt'))
      .useValue({ canActivate: () => true })
      .compile();

    appController = app.get<AppController>(AppController);
  });

  describe('getAttendance', () => {
    it('should return attendance message', () => {
      const result = appController.getAttendance();
      expect(result).toEqual({ message: 'attendance visible' });
    });
  });

  describe('markAttendance', () => {
    it('should return attendance registered message', () => {
      const result = appController.markAttendance();
      expect(result).toEqual({ message: 'attendance registered' });
    });
  });
});
