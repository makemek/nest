import { RuntimeException } from '@nestjs-client/core/errors/exceptions/runtime.exception';

export class InvalidProtoDefinitionException extends RuntimeException {
  constructor() {
    super('The invalid .proto definition (file not found)');
  }
}
