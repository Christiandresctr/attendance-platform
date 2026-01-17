import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { WinstonLoggerService } from '../common/logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new WinstonLoggerService();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, ip } = request;
    const userAgent = request.get('User-Agent') || '';
    const startTime = Date.now();

    // Generate or use existing trace ID
    const traceId = (request as any).traceId || uuidv4();
    (request as any).traceId = traceId;

    // Log request
    this.logger.logRequest(method, url, ip || 'unknown', userAgent, traceId);

    return next.handle().pipe(
      tap({
        next: () => {
          const { statusCode } = response;
          const duration = Date.now() - startTime;
          this.logger.logResponse(method, url, statusCode, duration, traceId);
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          const { statusCode } = response;
          
          // Log error response
          this.logger.logResponse(method, url, statusCode || 500, duration, traceId);
          
          // Log error details
          this.logger.error(
            `Request failed: ${method} ${url}`,
            error.stack,
            'HTTP'
          );
        }
      })
    );
  }
}