import { Logger } from '@nestjs-client/common';

export class TestingLogger extends Logger {
  constructor() {
    super('Testing');
  }

  log(message: string) {}
  warn(message: string) {}
  error(message: string, trace: string) {
    return Logger.error(message, trace, 'ExceptionHandler');
  }
}
