import { Module } from '@nestjs-client/common';
import { InjectService } from './inject.service';

@Module({
  providers: [InjectService],
})
export class InjectModule {}
