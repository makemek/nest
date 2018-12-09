import { Module } from '@nestjs-client/common';
import { MathModule } from './math/math.module';

@Module({
  imports: [MathModule],
})
export class ApplicationModule {}
