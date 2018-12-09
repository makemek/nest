import { Module } from '@nestjs-client/common';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
})
export class ApplicationModule {}
