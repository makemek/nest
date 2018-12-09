import { RuntimeException } from '@nestjs-client/core/errors/exceptions/runtime.exception';

export class InvalidGrpcServiceException extends RuntimeException {
  constructor() {
    super(`The invalid gRPC service (service not found)`);
  }
}
