import { Module } from '@nestjs-client/common';
import { CircularService } from './circular.service';
import { InputService } from './input.service';

@Module({
  providers: [CircularService, InputService],
})
export class CircularModule {}
