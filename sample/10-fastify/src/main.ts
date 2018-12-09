import { NestFactory, FastifyAdapter } from '@nestjs-client/core';
import { ValidationPipe } from '@nestjs-client/common';
import { ApplicationModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule, new FastifyAdapter());
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();