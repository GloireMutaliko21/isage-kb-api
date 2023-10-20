import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
    },
  });
  app.enableCors({
    methods: ['POST', 'GET', 'PUT', 'DELETE', 'OPTIONS'],
    origin: process.env.FRONTEND_URL,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
