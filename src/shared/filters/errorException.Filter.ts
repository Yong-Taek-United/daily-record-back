import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, HttpException, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(Error)
export class ErrorExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger();

  catch(exception: Error, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    console.log(exception);
    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      message = exception.message;
    }

    if (process.env.NODE_ENV === 'development')
      this.logger.error(
        `Failed to execute API {${request.url}, ${request.method}} route, HTTP ${statusCode} ${exception}`,
      );

    response.status(statusCode).json({
      error: true,
      statusCode,
      message,
      timestamp: new Date(),
      path: request.url,
    });
  }
}
