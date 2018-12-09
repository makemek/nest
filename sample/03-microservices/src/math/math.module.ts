import { Module } from '@nestjs-client/common';
import { MathController } from './math.controller';

@Module({
  controllers: [MathController],
})
export class MathModule {}
