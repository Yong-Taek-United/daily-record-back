import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  const corsOptions: CorsOptions = {
    origin: ['http://localhost:3000'], // 허용할 오리진 목록
    credentials: true, // 쿠키 허용
  };
  app.enableCors(corsOptions);
  await app.listen(5000);
}
bootstrap();
