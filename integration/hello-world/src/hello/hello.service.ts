import { Injectable } from '@nestjs-client/common';

@Injectable()
export class HelloService {
  greeting(): string {
    return 'Hello world!';
  }
}
