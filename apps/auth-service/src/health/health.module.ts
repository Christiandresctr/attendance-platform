import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthController } from './health.controller';
import { WinstonLoggerService } from '../common/logger.service';

@Module({
  imports: [
    TerminusModule.forRoot({
      logger: false, // Disable default logger
    }),
    TypeOrmModule.forFeature([]),
  ],
  controllers: [HealthController],
  providers: [
    HealthController,
    WinstonLoggerService,
  ],
  exports: [],
})
export class HealthModule {}