import { Module } from '@nestjs-client/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [
    CatsModule,
    GraphQLModule.forRoot({
      typePaths: [join(__dirname, '**', '*.graphql')],
    }),
  ],
})
export class ApplicationModule {}
