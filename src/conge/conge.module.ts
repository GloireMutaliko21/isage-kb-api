import { Module } from '@nestjs/common';
import { CongeService } from './conge.service';
import { CongeController } from './conge.controller';

@Module({
  providers: [CongeService],
  controllers: [CongeController]
})
export class CongeModule {}
