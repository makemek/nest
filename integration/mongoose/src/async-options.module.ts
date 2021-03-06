import { Module } from '@nestjs-client/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: 'mongodb://localhost:27017/test',
      }),
    }),
    CatsModule,
  ],
})
export class AsyncOptionsFactoryModule {}
