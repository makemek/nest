import { Module } from '@nestjs-client/common';
import { DependencyService } from './dependency.service';
import { PropertiesService } from './properties.service';

@Module({
  providers: [
    DependencyService,
    PropertiesService,
    {
      provide: 'token',
      useValue: true,
    },
  ],
})
export class PropertiesModule {}
