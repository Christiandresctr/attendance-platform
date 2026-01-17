import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ConfigService {
  private readonly logger = new Logger(ConfigService.name);

  constructor() {
    this.logger.log(`PORT=${this.port}`);
    this.logger.log(`NODE_ENV=${this.nodeEnv}`);
    this.logger.log(`JWT_SECRET_LOADED=${!!process.env.JWT_SECRET}`);
    this.logger.log(`AUTH_SERVICE_URL=${this.authServiceUrl}`);
    this.logger.log(`ATTENDANCE_SERVICE_URL=${this.attendanceServiceUrl}`);
  }

  get port(): number {
    return parseInt(process.env.PORT || '3002', 10);
  }

  get jwtSecret(): string {
    return process.env.JWT_SECRET || 'SECRET_KEY_DEMO';
  }

  get nodeEnv(): string {
    return process.env.NODE_ENV || 'development';
  }

  get attendanceServiceUrl(): string {
    return process.env.ATTENDANCE_SERVICE_URL || 'http://localhost:3001';
  }

  get authServiceUrl(): string {
    return process.env.AUTH_SERVICE_URL || 'http://localhost:3003';
  }

  get userServiceUrl(): string {
    return process.env.USER_SERVICE_URL || 'http://localhost:3004';
  }

  get scheduleServiceUrl(): string {
    return process.env.SCHEDULE_SERVICE_URL || 'http://localhost:3005';
  }

  get notificationServiceUrl(): string {
    return process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3006';
  }

  get reportServiceUrl(): string {
    return process.env.REPORT_SERVICE_URL || 'http://localhost:3007';
  }

  get auditServiceUrl(): string {
    return process.env.AUDIT_SERVICE_URL || 'http://localhost:3008';
  }

  get qrServiceUrl(): string {
    return process.env.QR_SERVICE_URL || 'http://localhost:3009';
  }

  get gpsServiceUrl(): string {
    return process.env.GPS_SERVICE_URL || 'http://localhost:3010';
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }
}
