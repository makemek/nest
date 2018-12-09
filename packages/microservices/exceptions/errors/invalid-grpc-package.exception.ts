import { RuntimeException } from '@nestjs-client/core/errors/exceptions/runtime.exception';

export class InvalidGrpcPackageException extends RuntimeException {
  constructor() {
    super('The invalid gRPC package (package not found)');
  }
}
