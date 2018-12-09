import { Module } from '@nestjs-client/common';
import { ApplicationGateway } from './app.gateway';

@Module({
  providers: [ApplicationGateway]
})
export class ApplicationModule {}
