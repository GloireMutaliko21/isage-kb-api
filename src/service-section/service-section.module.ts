import { Module } from '@nestjs/common';
import { ServiceSectionService } from './service-section.service';
import { ServiceSectionController } from './service-section.controller';

@Module({
  providers: [ServiceSectionService],
  controllers: [ServiceSectionController],
})
export class ServiceSectionModule {}
