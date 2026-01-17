import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from './security/roles.decorator';
import { RolesGuard } from './security/roles.guard';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('attendance')
export class AppController {

  @Roles('student', 'admin')
  @Get()
  getAttendance() {
    return { message: 'attendance visible' };
  }

  @Roles('teacher', 'admin')
  @Post()
  markAttendance() {
    return { message: 'attendance registered' };
  }
}
