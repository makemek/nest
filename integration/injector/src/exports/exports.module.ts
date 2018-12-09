import { Module } from '@nestjs-client/common';
import { ExportsService } from './exports.service';

@Module({
  exports: [ExportsService],
})
export class ExportsModule {}
