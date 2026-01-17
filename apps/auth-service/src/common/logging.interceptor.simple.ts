import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url } = request;
    const startTime = Date.now();

    try {
      return next.handle().pipe(
        tap({
          next: () => {
            const { statusCode } = response;
            const duration = Date.now() - startTime;
            console.log(`${method} ${url} - ${statusCode} - ${duration}ms`);
          },
        error: (error) => {
          const duration = Date.now() - startTime;
          const { statusCode } = response;
          console.error(`${method} ${url} - ${statusCode || 500} - ${duration}ms - Error: ${error.message}`);
          console.error('Full error:', error);
          console.error('Stack trace:', error.stack);
        }
        })
      );
    } catch (err) {
      console.error('Logging interceptor error:', err);
      return next.handle();
    }
  }
}