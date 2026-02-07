import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Attendance, AttendanceStatus } from '../entities/attendance.entity';
import { CreateAttendanceDto } from '../dto/create-attendance.dto';
import { UpdateAttendanceDto } from '../dto/update-attendance.dto';
import { ClassScheduleService } from './class-schedule.service';
import { ClassEnrollmentService } from './class-enrollment.service';
import { AcademicPeriodService } from './academic-period.service';
import { ClassSchedule } from '../entities/class-schedule.entity';
import { ClassEnrollment } from '../entities/class-enrollment.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepo: Repository<Attendance>,
    @InjectRepository(ClassSchedule)
    private readonly classScheduleRepo: Repository<ClassSchedule>,
    @InjectRepository(ClassEnrollment)
    private readonly classEnrollmentRepo: Repository<ClassEnrollment>,
    @Inject(AcademicPeriodService) 
    private readonly academicPeriodService: AcademicPeriodService,
  ) {}

  // 🔥 MARCAR ASISTENCIA - MÉTODO PRINCIPAL
  async markAttendance(createDto: CreateAttendanceDto): Promise<Attendance> {
    const now = new Date();

    // Validar duplicidad de asistencia (mismo estudiante, misma clase, mismo día)
    const existingAttendance = await this.findTodayAttendance(createDto.userId, createDto.classId);
    if (existingAttendance) {
      throw new BadRequestException('Attendance already marked today for this class');
    }

    // Validar que el estudiante esté matriculado
    const isEnrolled = await this.validateEnrollment(createDto.userId, createDto.classId);
    if (!isEnrolled) {
      throw new BadRequestException('Student is not enrolled in this class');
    }

    // Obtener horario de la clase para el día actual
    const dayOfWeek = this.getDayOfWeekNumber(now);
    const classSchedule = await this.getClassScheduleForDay(createDto.classId, dayOfWeek);

    if (!classSchedule) {
      throw new BadRequestException('No class schedule found for this day');
    }

    // Validar que sea hora válida para marcar asistencia
    const isValidWindow = this.validateAttendanceWindow(classSchedule, now);
    if (!isValidWindow) {
      throw new BadRequestException('Attendance can only be marked within class time window');
    }

    // Determinar estado automáticamente basado en el horario
    const status = this.determineAttendanceStatus(classSchedule.startTime, now, createDto.status);

    // Crear registro de asistencia
    const attendance = this.attendanceRepo.create({
      userId: createDto.userId,
      classId: createDto.classId,
      date: this.formatDate(now),
      time: now,
      status,
    });

    return await this.attendanceRepo.save(attendance);
  }

  // 📊 CONSULTAS MEJORADAS
  async findTodayAttendance(userId: string, classId: string): Promise<Attendance | null> {
    const startOfDay = new Date(new Date());
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(new Date());
    endOfDay.setHours(23, 59, 59, 999);

    return await this.attendanceRepo.findOne({
      where: {
        userId,
        classId,
        time: Between(startOfDay, endOfDay)
      },
    });
  }

  async findByStudent(studentId: string): Promise<Attendance[]> {
    return await this.attendanceRepo.find({
      where: { userId: studentId },
      relations: ['user', 'class'],
      order: { date: 'DESC', time: 'DESC' }
    });
  }

  async findByClass(classId: string): Promise<Attendance[]> {
    return await this.attendanceRepo.find({
      where: { classId },
      relations: ['user', 'class'],
      order: { date: 'DESC', time: 'DESC' }
    });
  }

  async findByStudentInDateRange(studentId: string, startDate: Date, endDate: Date): Promise<Attendance[]> {
    return await this.attendanceRepo.find({
      where: {
        userId: studentId,
        date: Between(startDate, endDate)
      },
      relations: ['user', 'class'],
      order: { date: 'ASC', time: 'ASC' }
    });
  }

  async findOne(id: string): Promise<Attendance> {
    const attendance = await this.attendanceRepo.findOne({
      where: { id },
      relations: ['user', 'class']
    });

    if (!attendance) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }

    return attendance;
  }

  async update(id: string, updateDto: UpdateAttendanceDto): Promise<Attendance> {
    const attendance = await this.findOne(id);
    const updatedAttendance = this.attendanceRepo.merge(attendance, updateDto);
    return await this.attendanceRepo.save(updatedAttendance);
  }

  async remove(id: string): Promise<void> {
    const attendance = await this.findOne(id);
    await this.attendanceRepo.remove(attendance);
  }

  // 🔍 MÉTODOS DE VALIDACIÓN INTEGRADA
  private async validateEnrollment(userId: string, classId: string): Promise<boolean> {
    const enrollment = await this.classEnrollmentRepo.findOne({
      where: {
        studentId: userId,
        classId,
      },
    });

    if (!enrollment || !enrollment.isActive) return false;
    
    // Validar que el período académico esté activo
    const now = new Date();
    const period = enrollment.academicPeriod;
    if (!period.isActive || now < period.startDate || now > period.endDate) {
      return false;
    }

    return true;
  }

  private async getClassScheduleForDay(classId: string, dayOfWeek: number): Promise<ClassSchedule | null> {
    return await this.classScheduleRepo.findOne({
      where: { 
        classId, 
        dayOfWeek, 
        isActive: true 
      },
      relations: ['class']
    });
  }

  private async getActivePeriodForClass(classId: string): Promise<any> {
    const schedules = await this.classScheduleRepo.find({
      where: { classId, isActive: true },
      relations: ['class']
    });

    if (schedules.length === 0) return null;
    
    const firstSchedule = schedules[0];
    return null; // TODO: Implement academic period logic
  }

  private async validateAttendanceWindow(schedule: ClassSchedule, currentTime: Date): Promise<boolean> {
    const classStartTime = this.parseTime(schedule.startTime);
    const classEndTime = this.parseTime(schedule.endTime);
    
    // Permitir marca 15 minutos antes del inicio y hasta el fin de clase
    const windowStart = new Date(classStartTime.getTime() - 15 * 60000);
    return currentTime >= windowStart && currentTime <= classEndTime;
  }

  private determineAttendanceStatus(classStartTime: string, currentTime: Date, overrideStatus?: AttendanceStatus): AttendanceStatus {
    if (overrideStatus) {
      return overrideStatus;
    }

    const classStartTimeDate = this.parseTime(classStartTime);
    const diffMinutes = (currentTime.getTime() - classStartTimeDate.getTime()) / 60000;

    if (diffMinutes < -15) {
      throw new BadRequestException('Cannot mark attendance earlier than 15 minutes before class start');
    } else if (diffMinutes <= 15) {
      return AttendanceStatus.PRESENT;
    } else if (diffMinutes <= 30) {
      return AttendanceStatus.LATE;
    } else {
      return AttendanceStatus.ABSENT;
    }
  }

  private parseTime(timeString: string): Date {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private getDayOfWeekNumber(date: Date): number {
    const day = date.getDay();
    return day === 0 ? 7 : day; // DOMINGO = 7 -> 7 (actual mapping)
  }

  // 📊 MÉTODOS DE ESTADÍSTICA
  async getAttendanceStatistics(
    classId: string, 
    startDate: Date, 
    endDate: Date
  ): Promise<{
    total: number;
    present: number;
    late: number;
    absent: number;
    attendanceRate: number;
  }> {
    const attendances = await this.attendanceRepo.find({
      where: {
        classId,
        date: Between(startDate, endDate)
      },
      relations: ['user', 'class']
    });

    const total = attendances.length;
    const present = attendances.filter(a => a.status === AttendanceStatus.PRESENT).length;
    const late = attendances.filter(a => a.status === AttendanceStatus.LATE).length;
    const absent = attendances.filter(a => a.status === AttendanceStatus.ABSENT).length;
    const attendanceRate = total > 0 ? (present / total) * 100 : 0;

    return { total, present, late, absent, attendanceRate };
  }

  // 📊 REPORTE DE USUARIO
  async getUserAttendanceReport(userId: string, startDate: Date, endDate: Date): Promise<any> {
    const userAttendances = await this.findByStudentInDateRange(userId, startDate, endDate);
    
    const reportData = {
      userId,
      totalClasses: await this.getUniqueClassCount(userAttendances),
      attendanceByClass: await this.groupAttendancesByClass(userAttendances),
      statistics: await this.calculateUserStatistics(userAttendances, startDate, endDate)
    };

    return reportData;
  }

  private async getUniqueClassCount(attendances: Attendance[]): Promise<number> {
    const uniqueClasses = new Set(attendances.map(a => a.classId));
    return uniqueClasses.size;
  }

  private async groupAttendancesByClass(attendances: Attendance[]): Promise<any> {
    const grouped = attendances.reduce((acc, curr) => {
      const classId = curr.classId;
      if (!acc[classId]) {
        acc[classId] = [];
      }
      acc[classId].push(curr);
      return acc;
    }, {});

    return grouped;
  }

  private async calculateUserStatistics(attendances: Attendance[], startDate: Date, endDate: Date): Promise<any> {
    const totalDays = this.getBusinessDaysBetween(startDate, endDate);
    const attendanceByDate = {};

    // Agrupar asistencia por fecha
    for (const attendance of attendances) {
      const dateKey = this.formatDate(attendance.date);
      if (!attendanceByDate[dateKey]) {
        attendanceByDate[dateKey] = [];
      }
      attendanceByDate[dateKey].push(attendance);
    }

    return {
      totalPossibleDays: totalDays,
      attendedDays: Object.keys(attendanceByDate).length,
      attendanceByClass: attendanceByDate,
      perfectAttendance: this.calculatePerfectAttendance(attendances, totalDays),
      report: this.generateUserReport(attendanceByDate)
    };
  }

  private getBusinessDaysBetween(startDate: Date, endDate: Date): number {
    let days = 0;
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      // Excluir sábados y domingos
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        days++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  }

  private calculatePerfectAttendance(attendances: Attendance[], totalDays: number): number {
    if (totalDays === 0) return 0;
    
    return Math.round((attendances.filter(a => a.status === AttendanceStatus.PRESENT || a.status === AttendanceStatus.LATE).length / totalDays) * 100);
  }

  private generateUserReport(attendanceByDate: Object): any {
    const report = {};
    
    for (const [date, attendances] of Object.entries(attendanceByDate)) {
      const presentCount = attendances.filter(a => a.status === AttendanceStatus.PRESENT).length;
      const lateCount = attendances.filter(a => a.status === AttendanceStatus.LATE).length;
      
      report[date] = {
        total: attendances.length,
        present: presentCount,
        late: lateCount,
        absent: attendances.filter(a => a.status === AttendanceStatus.ABSENT).length,
        rate: attendances.length > 0 ? Math.round((presentCount / attendances.length) * 100) : 0
      };
    }
    
    return report;
  }

  // 📊 ESTADÍSTICA AVANZADA
  async getSystemStatistics(startDate: Date, endDate: Date): Promise<any> {
    const allAttendances = await this.attendanceRepo.find({
      where: {
        date: Between(startDate, endDate)
      },
      relations: ['user', 'class']
    });

    const systemStats = {
      totalAttendances: allAttendances.length,
      overallRate: this.calculateOverallRate(allAttendances),
      byClass: this.groupAttendancesByClass(allAttendances),
      trends: this.analyzeTrends(allAttendances)
    };

    return systemStats;
  }

  private calculateOverallRate(attendances: Attendance[]): number {
    if (attendances.length === 0) return 0;
    const presentCount = attendances.filter(a => a.status === AttendanceStatus.PRESENT || a.status === AttendanceStatus.LATE).length;
    return Math.round((presentCount / attendances.length) * 100);
  }

  private async getSystemStatsByClass(attendances: Attendance[]): Promise<any> {
    const classStats = {};
    const classes = await this.getClassList();
    
    for (const classInfo of classes) {
      const classAttendances = attendances.filter(a => a.classId === classInfo.id);
      classStats[classInfo.id] = {
        className: classInfo.name,
        totalSessions: classAttendances.length,
        averageRate: this.calculateOverallRate(classAttendances),
        sessionsThisWeek: this.getAttendancesThisWeek(classInfo.id),
        topPerformingStudents: this.getTopStudents(classInfo.id)
      };
    }
    
    return classStats;
  }

  private async getClassList(): Promise<any[]> {
    return await this.attendanceRepo.find({ 
      relations: ['class']
    });
  }

  private async getAttendancesThisWeek(classId: string): Promise<Attendance[]> {
    const weekStart = this.getWeekStart();
    const weekEnd = this.getWeekEnd();
    
    return await this.attendanceRepo.find({
      where: {
        classId,
        date: Between(weekStart, weekEnd)
      },
      order: { date: 'ASC' }
    });
  }

  private getWeekStart(): Date {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - (now.getDay() === 0 ? 6 : now.getDay() - 1)); // Ajustar a lunes
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  }

  private getWeekEnd(): Date {
    const now = new Date();
    const endOfWeek = new Date(now);
    endOfWeek.setDate(now.getDate() + (now.getDay() === 0 ? 7 : now.getDay() - 1)); // Ajustar a domingo
    endOfWeek.setHours(23, 59, 59, 999);
    return endOfWeek;
  }

  private async getTopStudents(classId: string): Promise<any> {
    const classAttendances = await this.findByClass(classId);
    const attendanceByStudent = this.groupAttendancesByStudent(classAttendances);
    
    const studentRates = Object.entries(attendanceByStudent).map(([studentId, attendances]) => ({
      studentId,
      totalSessions: attendances.length,
      rate: this.calculateOverallRate(attendances)
    }));

    return studentRates
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 5);
  }

  private groupAttendancesByStudent(attendances: Attendance[]): Object {
    return attendances.reduce((acc, curr) => {
      const studentId = curr.userId;
      if (!acc[studentId]) {
        acc[studentId] = [];
      }
      acc[studentId].push(curr);
      return acc;
    }, {});
  }

  private analyzeTrends(attendances: Attendance[]): any {
    // Análisis de tendencias (ej: qué días hay más ausencias)
    const dayOfWeekTrends = [0, 0, 0, 0, 0, 0, 0]; // Lunes a Viernes
    
    for (const attendance of attendances) {
      const dayOfWeek = new Date(attendance.date).getDay();
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        dayOfWeekTrends[dayOfWeek - 1]++;
      }
    }

    return {
      dayOfWeekTrends,
      peakDays: dayOfWeekTrends.indexOf(Math.max(...dayOfWeekTrends)) + 1,
      leastAttendancedDay: dayOfWeekTrends.indexOf(Math.min(...dayOfWeekTrends)) + 1,
      trends: {
        weeklyAttendance: dayOfWeekTrends,
        monthlyTrends: this.getMonthlyTrends(attendances),
        seasonalTrends: this.getSeasonalTrends(attendances)
      }
    };
  }

  private getMonthlyTrends(attendances: Attendance[]): any {
    const monthlyData = {};
    
    for (const attendance of attendances) {
      const month = attendance.date.getMonth();
      if (!monthlyData[month]) {
        monthlyData[month] = { present: 0, late: 0, absent: 0 };
      }
      
      if (attendance.status === AttendanceStatus.PRESENT) monthlyData[month].present++;
      if (attendance.status === AttendanceStatus.LATE) monthlyData[month].late++;
      if (attendance.status === AttendanceStatus.ABSENT) monthlyData[month].absent++;
    }

    return monthlyData;
  }

  private getSeasonalTrends(attendances: Attendance[]): any {
    // Implementar análisis estacional (ej: invierno vs verano)
    // Por ahora, implementación básica
    return {
      semesters: ['Spring', 'Summer', 'Fall', 'Winter'],
      trends: this.getMonthlyTrends(attendances)
    };
  }

  private detectAnomalies(attendances: Attendance[]): any[] {
    const anomalies: any[] = [];
    
    // Detectar patrones inusuales
    for (const attendance of attendances) {
      const dayOfWeek = new Date(attendance.date).getDay();
      const hour = new Date(attendance.date).getHours();
      
      // Clases muy tempranas o muy tardías
      if (hour < 7 || hour > 22) {
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        anomalies.push({
          type: 'UNUSUAL_TIME',
          attendance: attendance.id,
          description: `Class at ${hour}:${new Date(attendance.date).getMinutes()} on ${dayNames[dayOfWeek]}`
        });
      }
    }
    
    return anomalies;
  }
}