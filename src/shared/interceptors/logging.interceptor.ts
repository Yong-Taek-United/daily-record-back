import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const startTime = process.hrtime();

    return next.handle().pipe(
      tap(() => {
        const elapsedTime = process.hrtime(startTime);
        const elapsedMilliseconds = elapsedTime[0] * 1000 + elapsedTime[1] / 1e6;

        this.logger.log(`API executed {${request.url}, ${request.method}} route +${elapsedMilliseconds.toFixed(2)} ms`);
      }),
    );
  }
}
