import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios';

interface ForwardHeaders {
  authorization?: string;
  [key: string]: string | undefined;
}

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      timeout: 10000,
    });
  }

  async forwardRequest(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    url: string,
    data?: unknown,
    headers?: Record<string, string>,
  ): Promise<unknown> {
    try {
      this.logger.log(`[${method}] Forwarding to ${url}`);

      const config = {
        headers: this.prepareHeaders(headers),
      };

      let response: AxiosResponse;

      switch (method) {
        case 'GET':
          response = await this.axiosInstance.get(url, config);
          break;
        case 'POST':
          response = await this.axiosInstance.post(url, data, config);
          break;
        case 'PUT':
          response = await this.axiosInstance.put(url, data, config);
          break;
        case 'DELETE':
          response = await this.axiosInstance.delete(url, config);
          break;
        case 'PATCH':
          response = await this.axiosInstance.patch(url, data, config);
          break;
        default:
          throw new HttpException(
            'Invalid HTTP method',
            HttpStatus.BAD_REQUEST,
          );
      }

      this.logger.log(`[${method}] ${url} → ${response.status}`);
      return response.data;
    } catch (error) {
      this.logger.error(
        `Error forwarding ${method} request to ${url}:`,
        error instanceof Error ? error.message : String(error),
      );
      this.handleError(error);
    }
  }

  private prepareHeaders(headers?: Record<string, string>): ForwardHeaders {
    const forwardedHeaders: ForwardHeaders = {};

    if (headers?.authorization) {
      forwardedHeaders.authorization = headers.authorization;
    }

    if (headers?.['content-type']) {
      forwardedHeaders['content-type'] = headers['content-type'];
    }

    return forwardedHeaders;
  }

  private handleError(error: unknown): never {
    if (error instanceof AxiosError) {
      if (error.response) {
        throw new HttpException(
          (error.response.data as unknown) || error.response.statusText,
          error.response.status || HttpStatus.BAD_GATEWAY,
        );
      } else if (error.request) {
        this.logger.error(
          'No response received from downstream service',
          error,
        );
        throw new HttpException(
          'Service temporarily unavailable',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }
    }

    throw new HttpException(
      'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
