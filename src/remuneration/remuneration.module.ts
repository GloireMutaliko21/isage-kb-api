import { Module } from '@nestjs/common';
import { RemunerationService } from './remuneration.service';
import { RemunerationController } from './remuneration.controller';

@Module({
  providers: [RemunerationService],
  controllers: [RemunerationController],
})
export class RemunerationModule {}
