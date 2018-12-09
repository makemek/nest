import { Module } from '@nestjs-client/common';
import { ExportsModule } from './exports/exports.module';

@Module({
  imports: [ExportsModule],
})
export class ApplicationModule {}
