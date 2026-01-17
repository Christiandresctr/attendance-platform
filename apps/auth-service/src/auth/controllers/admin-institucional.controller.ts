import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body, 
  Query,
  UseGuards,
  Logger
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { InstitucionalService } from '../services/institucional.service';
import { CreateStudentDto } from '../dto/create-student.dto';
import { UpdateStudentDto } from '../dto/update-student.dto';
import { CreateTeacherDto } from '../dto/create-teacher.dto';
import { UpdateTeacherDto } from '../dto/update-teacher.dto';
import { InstitucionalStudent } from '../entities/institucional-student.entity';
import { InstitucionalTeacher } from '../entities/institucional-teacher.entity';
import { InstitucionalAudit } from '../entities/institucional-audit.entity';

@Controller('admin/institucional')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles('administrador')
export class AdminInstitucionalController {
  private readonly logger = new Logger(AdminInstitucionalController.name);

  constructor(private readonly institucionalService: InstitucionalService) {}

  // ==================== ESTUDIANTES CRUD ====================

  @Get('students')
  async getStudents(): Promise<InstitucionalStudent[]> {
    this.logger.log('Obteniendo todos los estudiantes');
    return this.institucionalService.getAllStudents();
  }

  @Get('students/:id')
  async getStudent(@Param('id') id: string): Promise<InstitucionalStudent> {
    this.logger.log(`Obteniendo estudiante con ID: ${id}`);
    return this.institucionalService.getStudentById(id);
  }

  @Post('students')
  async createStudent(@Body() createStudentDto: CreateStudentDto): Promise<InstitucionalStudent> {
    this.logger.log(`Creando estudiante: ${createStudentDto.email}`);
    return this.institucionalService.createStudent(createStudentDto);
  }

  @Put('students/:id')
  async updateStudent(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto
  ): Promise<InstitucionalStudent> {
    this.logger.log(`Actualizando estudiante con ID: ${id}`);
    return this.institucionalService.updateStudent(id, updateStudentDto);
  }

  @Delete('students/:id')
  async deleteStudent(@Param('id') id: string): Promise<void> {
    this.logger.log(`Eliminando estudiante con ID: ${id}`);
    return this.institucionalService.deleteStudent(id);
  }

  // ==================== PROFESORES CRUD ====================

  @Get('teachers')
  async getTeachers(): Promise<InstitucionalTeacher[]> {
    this.logger.log('Obteniendo todos los profesores');
    return this.institucionalService.getAllTeachers();
  }

  @Get('teachers/:id')
  async getTeacher(@Param('id') id: string): Promise<InstitucionalTeacher> {
    this.logger.log(`Obteniendo profesor con ID: ${id}`);
    return this.institucionalService.getTeacherById(id);
  }

  @Post('teachers')
  async createTeacher(@Body() createTeacherDto: CreateTeacherDto): Promise<InstitucionalTeacher> {
    this.logger.log(`Creando profesor: ${createTeacherDto.email}`);
    return this.institucionalService.createTeacher(createTeacherDto);
  }

  @Put('teachers/:id')
  async updateTeacher(
    @Param('id') id: string,
    @Body() updateTeacherDto: UpdateTeacherDto
  ): Promise<InstitucionalTeacher> {
    this.logger.log(`Actualizando profesor con ID: ${id}`);
    return this.institucionalService.updateTeacher(id, updateTeacherDto);
  }

  @Delete('teachers/:id')
  async deleteTeacher(@Param('id') id: string): Promise<void> {
    this.logger.log(`Eliminando profesor con ID: ${id}`);
    return this.institucionalService.deleteTeacher(id);
  }

  // ==================== VALIDACIÓN Y AUDITORÍA ====================

  @Post('validate-email')
  async validateEmail(@Body() body: { email: string }): Promise<{
    isValid: boolean;
    userType: 'student' | 'teacher' | 'not_found';
    userData?: any;
  }> {
    this.logger.log(`Validando email: ${body.email}`);
    return this.institucionalService.validateEmail(body.email);
  }

  @Get('audit')
  async getAuditLogs(@Query('limit') limit?: string): Promise<InstitucionalAudit[]> {
    this.logger.log('Obteniendo logs de auditoría');
    return this.institucionalService.getAuditLogs(limit ? parseInt(limit) : 100);
  }

  @Get('stats')
  async getStats(): Promise<{
    totalStudents: number;
    totalTeachers: number;
    totalActiveUsers: number;
    recentRegistrations: number;
  }> {
    this.logger.log('Obteniendo estadísticas del sistema');
    
    const students = await this.institucionalService.getAllStudents();
    const teachers = await this.institucionalService.getAllTeachers();
    
    return {
      totalStudents: students.length,
      totalTeachers: teachers.length,
      totalActiveUsers: students.length + teachers.length,
      recentRegistrations: 0 // TODO: Implementar cálculo de registros recientes
    };
  }
}