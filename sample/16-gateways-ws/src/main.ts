import { NestFactory } from '@nestjs-client/core';
import { WsAdapter } from '@nestjs-client/websockets/adapters';
import { ApplicationModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  app.useWebSocketAdapter(new WsAdapter(app.getHttpServer()));
  await app.listen(3000);
}
bootstrap();
