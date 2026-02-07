import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../../security/roles.guard';
import { Roles } from '../../security/roles.decorator';
import { AcademicPeriodService } from '../services/academic-period.service';
import { CreateAcademicPeriodDto } from '../dto/create-academic-period.dto';
import { UpdateAcademicPeriodDto } from '../dto/update-academic-period.dto';
import { AcademicPeriod } from '../entities/academic-period.entity';


@ApiTags('Academic Periods')
@Controller('academic-periods')
@UseGuards(RolesGuard)
@Roles('ADMINISTRADOR')
export class AcademicPeriodController {
  constructor(private readonly academicPeriodService: AcademicPeriodService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new academic period' })
  @ApiResponse({ status: 201, description: 'Academic period created successfully' })
  create(@Body() createDto: CreateAcademicPeriodDto) {
    return this.academicPeriodService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all academic periods' })
  @ApiResponse({ status: 200, description: 'Academic periods retrieved successfully', type: [AcademicPeriod] })
  findAll() {
    return this.academicPeriodService.findAll();
  }

  @Get('active')
  @ApiOperation({ summary: 'Get current academic period' })
  @ApiResponse({ status: 200, description: 'Current academic period retrieved successfully', type: AcademicPeriod })
  findActive() {
    return this.academicPeriodService.findActive();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get academic period by ID' })
  @ApiResponse({ status: 200, description: 'Academic period retrieved successfully', type: AcademicPeriod })
  findOne(@Param('id') id: string) {
    return this.academicPeriodService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update academic period' })
  @ApiResponse({ status: 200, description: 'Academic period updated successfully', type: AcademicPeriod })
  update(@Param('id') id: string, @Body() updateDto: UpdateAcademicPeriodDto) {
    return this.academicPeriodService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete academic period' })
  @ApiResponse({ status: 200, description: 'Academic period deleted successfully' })
  remove(@Param('id') id: string) {
    return this.academicPeriodService.deactivate(id);
  }
}