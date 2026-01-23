import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Attendance, AttendanceStatus } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepo: Repository<Attendance>,
  ) {}

  // POST - Marcar asistencia
  async markAttendance(createDto: CreateAttendanceDto) {
    const now = new Date();

    // 🔍 Rango del día para evitar doble asistencia
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const exists = await this.attendanceRepo.findOne({
      where: {
        userId: createDto.userId,
        classId: createDto.classId,
        time : Between(startOfDay, endOfDay),
      },
    });

    if (exists) {
      throw new BadRequestException('Attendance already marked today');
    }

    // ⏰ EJEMPLO: hora de inicio de clase (esto idealmente viene de BD)
    const classStart = new Date(now);
    classStart.setHours(8, 0, 0, 0); // 08:00 AM ejemplo

    const diffMinutes =
      (now.getTime() - classStart.getTime()) / 1000 / 60;

    const status =
      diffMinutes <= 15
        ? AttendanceStatus.PRESENT
        : AttendanceStatus.LATE;

    const attendance = this.attendanceRepo.create({
      userId: createDto.userId,
      classId: createDto.classId,
      date: now,        // ✅ fecha + hora real
      time: now,
      status,
    });

    return this.attendanceRepo.save(attendance);
  }

  // GET - Listar todas las asistencias
  async findAll() {
    return this.attendanceRepo.find();
  }

  // GET - Obtener por ID
  async findOne(id: string) {
    const attendance = await this.attendanceRepo.findOne({
      where: { id },
    });

    if (!attendance) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }

    return attendance;
  }

  // PUT - Actualizar asistencia
  async update(id: string, updateDto: UpdateAttendanceDto) {
    const attendance = await this.findOne(id);
    const updatedAttendance = this.attendanceRepo.merge(attendance, updateDto);
    return this.attendanceRepo.save(updatedAttendance);
  }

  // DELETE - Eliminar asistencia
  async remove(id: string) {
    const attendance = await this.findOne(id);
    return this.attendanceRepo.remove(attendance);
  }
}
