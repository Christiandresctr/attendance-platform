import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  UseGuards,
  Req,
  Body,
  Param,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ProxyService } from './services/proxy.service';
import { ConfigService } from './config/config.service';

interface RequestWithHeaders extends Request {
  headers: Record<string, string | string[] | undefined>;
}

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(
    private readonly proxyService: ProxyService,
    private readonly configService: ConfigService,
  ) {}

  // ==================== Attendance Routes ====================
  @UseGuards(AuthGuard('jwt'))
  @Get('attendance')
  async getAttendance(@Req() req: RequestWithHeaders): Promise<unknown> {
    const url = `${this.configService.attendanceServiceUrl}/attendance`;
    return this.proxyService.forwardRequest(
      'GET',
      url,
      undefined,
      req.headers as Record<string, string>,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('attendance/:id')
  async getAttendanceById(
    @Req() req: RequestWithHeaders,
    @Param('id') id: string,
  ) {
    const url = `${this.configService.attendanceServiceUrl}/attendance/${id}`;
    return this.proxyService.forwardRequest(
      'GET',
      url,
      undefined,
      req.headers as Record<string, string>,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('attendance')
  async createAttendance(
    @Req() req: RequestWithHeaders,
    @Body() body: unknown,
  ) {
    const url = `${this.configService.attendanceServiceUrl}/attendance`;
    return this.proxyService.forwardRequest(
      'POST',
      url,
      body,
      req.headers as Record<string, string>,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('attendance/:id')
  async updateAttendance(
    @Req() req: RequestWithHeaders,
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    const url = `${this.configService.attendanceServiceUrl}/attendance/${id}`;
    return this.proxyService.forwardRequest(
      'PUT',
      url,
      body,
      req.headers as Record<string, string>,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('attendance/:id')
  async deleteAttendance(
    @Req() req: RequestWithHeaders,
    @Param('id') id: string,
  ) {
    const url = `${this.configService.attendanceServiceUrl}/attendance/${id}`;
    return this.proxyService.forwardRequest(
      'DELETE',
      url,
      undefined,
      req.headers as Record<string, string>,
    );
  }

  @Patch('attendance/:id')
  @UseGuards(AuthGuard('jwt'))
  async patchAttendance(
    @Req() req: RequestWithHeaders,
    @Param('id') id: string,
    @Body() body: unknown,
  ) {
    const url = `${this.configService.attendanceServiceUrl}/attendance/${id}`;
    return this.proxyService.forwardRequest(
      'PATCH',
      url,
      body,
      req.headers as Record<string, string>,
    );
  }

  // ==================== Auth Proxy ====================
  @Post('auth/register')
  async register(@Req() req: RequestWithHeaders, @Body() body: unknown) {
    const url = `${this.configService.authServiceUrl}/auth/register`;
    return this.proxyService.forwardRequest(
      'POST',
      url,
      body,
      req.headers as Record<string, string>,
    );
  }

  @Post('auth/login')
  async login(@Req() req: RequestWithHeaders, @Body() body: unknown) {
    const url = `${this.configService.authServiceUrl}/auth/login`;
    return this.proxyService.forwardRequest(
      'POST',
      url,
      body,
      req.headers as Record<string, string>,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('auth/profile')
  async profile(@Req() req: RequestWithHeaders) {
    const url = `${this.configService.authServiceUrl}/auth/profile`;
    return this.proxyService.forwardRequest(
      'GET',
      url,
      undefined,
      req.headers as Record<string, string>,
    );
  }

  // ==================== Health Check ====================
  @Get('health')
  health(): { status: string; timestamp: string; service: string } {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'api-gateway',
    };
  }
}
