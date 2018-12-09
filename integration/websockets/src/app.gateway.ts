import { WebSocketGateway, SubscribeMessage } from '@nestjs-client/websockets';

@WebSocketGateway(8080)
export class ApplicationGateway {
  @SubscribeMessage('push')
  onPush(client, data) {
    return {
      event: 'pop',
      data,
    };
  }
}
