import { BadRequestException } from '@nestjs-client/common';
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs-client/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string> {
  async transform(value: string, metadata: ArgumentMetadata) {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed');
    }
    return val;
  }
}
