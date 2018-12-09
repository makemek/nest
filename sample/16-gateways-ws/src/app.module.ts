import { Module } from '@nestjs-client/common';
import { EventsModule } from './events/events.module';

@Module({
  imports: [EventsModule],
})
export class ApplicationModule {}
