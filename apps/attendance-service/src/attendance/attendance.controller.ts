import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @UseGuards(AuthGuard('jwt'))
  
  // POST - Marcar asistencia
  @Post()
  mark(@Req() req, @Body() createDto: CreateAttendanceDto) {
    return this.attendanceService.markAttendance(createDto);
  }

  // GET - Listar todas
  @Get()
  findAll() {
    return this.attendanceService.findAll();
  }

  // GET - Obtener por ID
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendanceService.findOne(id);
  }

  // PUT - Actualizar
  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateAttendanceDto) {
    return this.attendanceService.update(id, updateDto);
  }

  // DELETE - Eliminar
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendanceService.remove(id);
  }
}