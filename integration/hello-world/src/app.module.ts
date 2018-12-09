import { Module } from '@nestjs-client/common';
import { HelloModule } from './hello/hello.module';

@Module({
  imports: [HelloModule],
})
export class ApplicationModule {}
