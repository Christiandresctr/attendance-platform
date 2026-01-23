import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common'; // ✅ Request aquí es solo para el decorador
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import type { Request as ExpressRequest } from 'express'; // ✅ tipo renombrado para TS

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req: ExpressRequest) { // ⚡ usa el tipo ExpressRequest aquí
    return req.user;
  }
}