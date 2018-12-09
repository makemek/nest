import { Module } from '@nestjs-client/common';
import { HeroController } from './hero.controller';

@Module({
  controllers: [HeroController],
})
export class HeroModule {}
