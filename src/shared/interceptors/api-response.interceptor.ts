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

        const { statusCode, message, data, redirect } = response;

        if (!!redirect) {
          const frontendBaseUrl = this.configService.get<string>('REDIRECT_ORIGIN');
          httpResponse.redirect(`${frontendBaseUrl}${redirect}`);
        } else {
          httpResponse.status(statusCode);
          return {
            success: true,
            statusCode,
            message: message || '요청이 성공적으로 처리되었습니다.',
            data,
          };
        }
      }),
    );
  }
}
