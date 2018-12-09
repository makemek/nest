import { Injectable } from '@nestjs-client/common';

@Injectable()
export class AppService {
  get() {
    return 'Hello world!';
  }
}
