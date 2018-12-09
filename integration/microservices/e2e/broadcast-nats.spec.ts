import * as express from 'express';
import * as request from 'supertest';
import { Test } from '@nestjs-client/testing';
import { INestApplication } from '@nestjs-client/common';
import { Transport } from '@nestjs-client/microservices';
import { NatsBroadcastController } from '../src/nats/nats-broadcast.controller';

describe('NATS transport', () => {
  let server;
  let app: INestApplication;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [NatsBroadcastController],
    }).compile();

    server = express();
    app = module.createNestApplication(server);
    app.connectMicroservice({
      transport: Transport.NATS,
    });
    app.connectMicroservice({
      transport: Transport.NATS,
    });
    await app.startAllMicroservicesAsync();
    await app.init();
  });

  it(`Broadcast (2 subscribers)`, () => {
    return request(server)
      .get('/broadcast')
      .expect(200, '2');
  });

  afterEach(async () => {
    await app.close();
  });
});
