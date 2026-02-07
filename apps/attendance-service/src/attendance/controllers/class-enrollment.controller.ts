import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../../security/roles.guard';
import { Roles } from '../../security/roles.decorator';
import { ClassEnrollmentService } from '../services/class-enrollment.service';
import { CreateClassEnrollmentDto } from '../dto/create-class-enrollment.dto';
import { UpdateClassEnrollmentDto } from '../dto/update-class-enrollment.dto';
import { ClassEnrollment } from '../entities/class-enrollment.entity';
import { Patch } from '@nestjs/common';


@ApiTags('Class Enrollments')
@Controller('class-enrollments')
@UseGuards(RolesGuard)
@Roles('PROFESOR', 'ADMINISTRADOR')
export class ClassEnrollmentController {
  constructor(private readonly classEnrollmentService: ClassEnrollmentService) {}

  @Post()
  @ApiOperation({ summary: 'Enroll student in class' })
  @ApiResponse({ status: 201, description: 'Student enrolled successfully' })
  create(@Body() createDto: CreateClassEnrollmentDto) {
    return this.classEnrollmentService.create(createDto);
  }

  @Get('student/:studentId')
  @ApiOperation({ summary: 'Get enrollments by student' })
  @ApiResponse({ status: 200, description: 'Enrollments retrieved successfully', type: [ClassEnrollment] })
  findByStudent(@Param('studentId') studentId: string) {
    return this.classEnrollmentService.findByStudent(studentId);
  }

  @Get('class/:classId')
  @ApiOperation({ summary: 'Get enrollments by class' })
  @ApiResponse({ status: 200, description: 'Enrollments retrieved successfully', type: [ClassEnrollment] })
  findByClass(@Param('classId') classId: string) {
    return this.classEnrollmentService.findByClass(classId);
  }

  @Get('class/:classId/stats')
  @ApiOperation({ summary: 'Get enrollment statistics for class' })
  @ApiResponse({ status: 200, description: 'Enrollment statistics retrieved successfully', type: Object })
  getClassStats(@Param('classId') classId: string) {
    return this.classEnrollmentService.getEnrollmentStats(classId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get enrollment by ID' })
  @ApiResponse({ status: 200, description: 'Enrollment retrieved successfully', type: ClassEnrollment })
  findOne(@Param('id') id: string) {
    return this.classEnrollmentService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update enrollment' })
  @ApiResponse({ status: 200, description: 'Enrollment updated successfully', type: ClassEnrollment })
  update(@Param('id') id: string, @Body() updateDto: UpdateClassEnrollmentDto) {
    return this.classEnrollmentService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel enrollment' })
  @ApiResponse({ status: 200, description: 'Enrollment cancelled successfully' })
  cancel(@Param('id') id: string) {
    return this.classEnrollmentService.cancel(id);
  }

  @Post(':id/reactivate')
  @ApiOperation({ summary: 'Reactivate enrollment' })
  @ApiResponse({ status: 200, description: 'Enrollment reactivated successfully', type: ClassEnrollment })
  reactivate(@Param('id') id: string) {
    return this.classEnrollmentService.reactivate(id);
  }
}
