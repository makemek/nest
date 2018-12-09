import { Module } from '@nestjs-client/common';
import { HeroModule } from './hero/hero.module';

@Module({
  imports: [HeroModule],
})
export class ApplicationModule {}
