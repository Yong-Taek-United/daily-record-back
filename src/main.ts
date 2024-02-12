import { AppModule } from './app/app.module';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  const port = Number(config.get<number>('PORT'));
  const corsOriginDevelopment = config.get<string>('CORS_ORIGIN_DEVELOPMENT');
  const corsOriginProduction = config.get<string>('CORS_ORIGIN_PRODUCTION');
  const corsOriginProduction2 = config.get<string>('CORS_ORIGIN_PRODUCTION_WWW');

  app.enableCors({
    origin: [corsOriginDevelopment, corsOriginProduction, corsOriginProduction2],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Daily Record')
    .setDescription('Project "Daily Record" API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);
}
bootstrap();
