import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ApiResponseInterceptor implements NestInterceptor {
  constructor(private configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        const httpResponse = context.switchToHttp().getResponse();

        if (!response) {
          return httpResponse.status(500).send({
            success: false,
            statusCode: 500,
            message: '예상치 못한 오류가 발생하여 요청을 처리할 수 없습니다.',
          });
        }

        const { statusCode, message, data, redirect } = response;

        const frontendBaseUrl = this.configService.get<string>('CORS_ORIGIN');

        if (redirect) {
          httpResponse.redirect(`${frontendBaseUrl}${redirect}`);
        } else {
          httpResponse.status(statusCode).send({
            success: true,
            statusCode,
            message: message || '요청이 성공적으로 처리되었습니다.',
            data,
          });
        }
      }),
    );
  }
}
