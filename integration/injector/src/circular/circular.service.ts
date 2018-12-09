import { Injectable, forwardRef, Inject } from '@nestjs-client/common';
import { InputService } from './input.service';

@Injectable()
export class CircularService {
  constructor(
    @Inject(forwardRef(() => InputService))
    public readonly service: InputService,
  ) {}
}