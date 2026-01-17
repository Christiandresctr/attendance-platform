import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  constructor() {}

  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'Auth Service is running'
    };
  }

  @Get('readiness')
  readiness() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'Auth Service is ready'
    };
  }

  @Get('liveness')
  liveness() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'Auth Service is alive'
    };
  }
}