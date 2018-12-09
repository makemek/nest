import { Module } from '@nestjs-client/common';
import { AppController } from './app.controller';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [],
})
export class ApplicationModule {}
