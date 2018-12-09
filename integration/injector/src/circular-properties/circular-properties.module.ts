import { forwardRef, Module } from '@nestjs-client/common';
import { CircularService } from './circular.service';
import { InputPropertiesModule } from './input-properties.module';

@Module({
  imports: [forwardRef(() => InputPropertiesModule)],
  providers: [CircularService],
  exports: [CircularService],
})
export class CircularPropertiesModule {}
