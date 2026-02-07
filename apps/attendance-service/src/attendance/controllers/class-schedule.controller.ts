import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../../security/roles.guard';
import { Roles } from '../../security/roles.decorator';
import { ClassScheduleService } from '../services/class-schedule.service';
import { CreateClassScheduleDto } from '../dto/create-class-schedule.dto';
import { UpdateClassScheduleDto } from '../dto/update-class-schedule.dto';
import { ClassSchedule } from '../entities/class-schedule.entity';

@ApiTags('Class Schedules')
@Controller('class-schedules')
@UseGuards(RolesGuard)
@Roles('PROFESOR', 'ADMINISTRADOR')
export class ClassScheduleController {
  constructor(private readonly classScheduleService: ClassScheduleService) {}

  @Post()
  @ApiOperation({ summary: 'Create class schedule' })
  @ApiResponse({ status: 201, description: 'Class schedule created successfully' })
  create(@Body() createDto: CreateClassScheduleDto) {
    return this.classScheduleService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all class schedules' })
  @ApiResponse({ status: 200, description: 'Class schedules retrieved successfully', type: [ClassSchedule] })
  findAll() {
    return this.classScheduleService.findAll();
  }

  @Get('class/:classId')
  @ApiOperation({ summary: 'Get schedules by class' })
  @ApiResponse({ status: 200, description: 'Class schedules retrieved successfully', type: [ClassSchedule] })
  findByClass(@Param('classId') classId: string) {
    return this.classScheduleService.findByClass(classId);
  }

  @Get('class/:classId/semester/:semester')
  @ApiOperation({ summary: 'Get schedules by class and semester' })
  @ApiResponse({ status: 200, description: 'Class schedules retrieved successfully', type: [ClassSchedule] })
  findByClassAndSemester(@Param('classId') classId: string, @Param('semester') semester: string) {
    return this.classScheduleService.findByClassAndSemester(classId, parseInt(semester));
  }

  @Get('day/:dayOfWeek')
  @ApiOperation({ summary: 'Get schedules by day of week' })
  @ApiResponse({ status: 200, description: 'Class schedules retrieved successfully', type: [ClassSchedule] })
  findByDay(@Param('dayOfWeek') dayOfWeek: string) {
    return this.classScheduleService.findByDay(parseInt(dayOfWeek));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get schedule by ID' })
  @ApiResponse({ status: 200, description: 'Class schedule retrieved successfully', type: ClassSchedule })
  findOne(@Param('id') id: string) {
    return this.classScheduleService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update class schedule' })
  @ApiResponse({ status: 200, description: 'Class schedule updated successfully', type: ClassSchedule })
  update(@Param('id') id: string, @Body() updateDto: UpdateClassScheduleDto) {
    return this.classScheduleService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete class schedule' })
  @ApiResponse({ status: 200, description: 'Class schedule deleted successfully' })
  remove(@Param('id') id: string) {
    return this.classScheduleService.remove(id);
  }
}