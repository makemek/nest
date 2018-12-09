import { Module } from '@nestjs-client/common';
import { AppController } from './app.controller';

@Module({
  controllers: [AppController],
})
export class ApplicationModule {}
