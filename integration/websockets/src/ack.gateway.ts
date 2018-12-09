import { SubscribeMessage, WebSocketGateway } from '@nestjs-client/websockets';

@WebSocketGateway(8080)
export class AckGateway {
  @SubscribeMessage('push')
  onPush() {
    return 'pong';
  }
}
