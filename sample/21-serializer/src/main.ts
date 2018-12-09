import { ValidationPipe } from '@nestjs-client/common';
import { NestFactory } from '@nestjs-client/core';
import { ApplicationModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
