import { BadGatewayException, CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        const httpResponse = context.switchToHttp().getResponse();
        const { statusCode, message, data } = response;

        httpResponse.status(statusCode).send({
          success: true,
          statusCode,
          message: message || '요청이 성공적으로 처리되었습니다.',
          data,
        });
      }),
    );
  }
}
