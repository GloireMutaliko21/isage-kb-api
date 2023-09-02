import { Module } from '@nestjs/common';
import { ImmobilisationService } from './immobilisation.service';
import { ImmobilisationController } from './immobilisation.controller';

@Module({
  providers: [ImmobilisationService],
  controllers: [ImmobilisationController]
})
export class ImmobilisationModule {}
