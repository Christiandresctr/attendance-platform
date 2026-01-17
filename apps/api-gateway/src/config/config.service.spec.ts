import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from './config.service';

describe('ConfigService', () => {
  let service: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService],
    }).compile();

    service = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return port from environment', () => {
    process.env.PORT = '3002';
    expect(service.port).toBe(3002);
  });

  it('should return default port if not set', () => {
    delete process.env.PORT;
    expect(service.port).toBe(3002);
  });

  it('should return JWT secret', () => {
    expect(service.jwtSecret).toBeDefined();
  });

  it('should return service URLs', () => {
    expect(service.attendanceServiceUrl).toBeDefined();
    expect(service.authServiceUrl).toBeDefined();
  });
});
