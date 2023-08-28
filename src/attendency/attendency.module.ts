import { Module } from '@nestjs/common';
import { AttendencyService } from './attendency.service';
import { AttendencyController } from './attendency.controller';

@Module({
  providers: [AttendencyService],
  controllers: [AttendencyController]
})
export class AttendencyModule {}
