import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { join } from 'path';

@Injectable()
export class WinstonLoggerService implements LoggerService {
  private readonly logger: winston.Logger;
  private readonly context: string;

  constructor() {
    this.context = 'AuthService';
    
    // Define log format
    const logFormat = winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      winston.format.errors({ stack: true }),
      winston.format.json(),
      winston.format.printf(({ timestamp, level, message, context, traceId, userId, ip, ...meta }) => {
        return JSON.stringify({
          timestamp,
          level: level.toUpperCase(),
          message,
          context: context || this.context,
          traceId,
          userId,
          ip,
          ...meta
        });
      })
    );

    // Console format for development
    const consoleFormat = winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({
        format: 'HH:mm:ss'
      }),
      winston.format.printf(({ timestamp, level, message, context }) => {
        return `${timestamp} [${context || this.context}] ${level}: ${message}`;
      })
    );

    // Create transports
    const transports: winston.transport[] = [];

    // Console transport
    if (process.env.NODE_ENV !== 'production') {
      transports.push(
        new winston.transports.Console({
          format: consoleFormat,
        })
      );
    }

    // File transports for production
    if (process.env.NODE_ENV === 'production') {
      // Error logs
      transports.push(
        new DailyRotateFile({
          filename: join(process.env.LOG_FILE_PATH || './logs', 'error-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          level: 'error',
          format: logFormat,
          maxSize: '20m',
          maxFiles: '14d',
          zippedArchive: true,
        })
      );

      // Combined logs
      transports.push(
        new DailyRotateFile({
          filename: join(process.env.LOG_FILE_PATH || './logs', 'combined-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          format: logFormat,
          maxSize: '20m',
          maxFiles: '14d',
          zippedArchive: true,
        })
      );

      // Security logs
      transports.push(
        new DailyRotateFile({
          filename: join(process.env.LOG_FILE_PATH || './logs', 'security-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          level: 'warn',
          format: logFormat,
          maxSize: '20m',
          maxFiles: '30d',
          zippedArchive: true,
        })
      );
    }

    this.logger = winston.createLogger({
      level: process.env.LOG_LEVEL || 'info',
      format: logFormat,
      transports,
      exitOnError: false,
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context: context || this.context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { 
      trace, 
      context: context || this.context 
    });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context: context || this.context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context: context || this.context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context: context || this.context });
  }

  // Security-specific logging methods
  logSecurity(event: string, details: any, userId?: string, ip?: string) {
    this.logger.warn(event, {
      context: 'SECURITY',
      event,
      details,
      userId,
      ip,
      timestamp: new Date().toISOString()
    });
  }

  logAuthAttempt(email: string, success: boolean, ip?: string, userId?: string) {
    this.logSecurity('AUTH_ATTEMPT', {
      email,
      success,
      timestamp: new Date().toISOString()
    }, userId, ip);
  }

  logRateLimitExceeded(ip: string, endpoint: string, userId?: string) {
    this.logSecurity('RATE_LIMIT_EXCEEDED', {
      endpoint,
      timestamp: new Date().toISOString()
    }, userId, ip);
  }

  logSuspiciousActivity(details: any, ip?: string, userId?: string) {
    this.logSecurity('SUSPICIOUS_ACTIVITY', {
      ...details,
      timestamp: new Date().toISOString()
    }, userId, ip);
  }

  // Request logging with correlation
  logRequest(method: string, url: string, ip: string, userAgent?: string, traceId?: string) {
    this.logger.info('HTTP Request', {
      context: 'HTTP',
      method,
      url,
      ip,
      userAgent,
      traceId,
      timestamp: new Date().toISOString()
    });
  }

  logResponse(method: string, url: string, statusCode: number, duration: number, traceId?: string) {
    this.logger.info('HTTP Response', {
      context: 'HTTP',
      method,
      url,
      statusCode,
      duration,
      traceId,
      timestamp: new Date().toISOString()
    });
  }
}