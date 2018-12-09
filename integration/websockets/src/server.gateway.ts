import { WebSocketGateway, SubscribeMessage } from '@nestjs-client/websockets';

@WebSocketGateway()
export class ServerGateway {
  @SubscribeMessage('push')
  onPush(client, data) {
    return {
      event: 'pop',
      data,
    };
  }
}
