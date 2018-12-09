import { Controller, Get } from '@nestjs-client/common';
import {
  Client,
  MessagePattern,
  ClientProxy,
  Transport,
} from '@nestjs-client/microservices';
import { Observable } from 'rxjs';
import { scan, take } from 'rxjs/operators';

@Controller()
export class RedisBroadcastController {
  @Client({ transport: Transport.REDIS })
  client: ClientProxy;

  @Get('broadcast')
  multicats() {
    return this.client.send<number>({ cmd: 'broadcast' }, {})
      .pipe(
        scan((a, b) => a + b),
        take(2),
      );
  }

  @MessagePattern({ cmd: 'broadcast' })
  replyBroadcast(): Observable<number> {
    return new Observable((observer) => observer.next(1));
  }
}
