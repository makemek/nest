import { INestApplication } from '@nestjs-client/common';
import { NestFactory } from '@nestjs-client/core';
import * as request from 'supertest';
import { AsyncApplicationModule } from '../src/async-options.module';

describe('GraphQL (async configuration)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await NestFactory.create(AsyncApplicationModule, { logger: false });
    await app.init();
  });

  it(`should return query result`, () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: null,
        variables: {},
        query: '{\n  getCats {\n    id\n  }\n}\n',
      })
      .expect(200, {
        data: {
          getCats: [
            {
              id: 1,
            },
          ],
        },
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
