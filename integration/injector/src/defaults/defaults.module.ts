import { Module } from '@nestjs-client/common';
import { DefaultsService } from './defaults.service';

@Module({
  providers: [DefaultsService],
})
export class DefaultsModule {}
