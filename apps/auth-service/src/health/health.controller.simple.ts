import { Controller, Get } from '@nestjs/common';
import { WinstonLoggerService } from '../common/logger.service';

@Controller('health')
export class HealthController {
  constructor(
    private readonly logger: WinstonLoggerService,
  ) {}

  @Get()
  check() {
    try {
      this.logger.log('Simple health check requested', 'HealthController');
      
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        message: 'Auth Service is running'
      };
    } catch (error) {
      this.logger.error('Simple health check failed', error.stack, 'HealthController');
      throw error;
    }
  }

  @Get('readiness')
  readiness() {
    try {
      this.logger.log('Readiness check requested', 'HealthController');
      
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        message: 'Auth Service is ready'
      };
    } catch (error) {
      this.logger.error('Readiness check failed', error.stack, 'HealthController');
      throw error;
    }
  }

  @Get('liveness')
  liveness() {
    try {
      this.logger.log('Liveness check requested', 'HealthController');
      
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        message: 'Auth Service is alive'
      };
    } catch (error) {
      this.logger.error('Liveness check failed', error.stack, 'HealthController');
      throw error;
    }
  }
}