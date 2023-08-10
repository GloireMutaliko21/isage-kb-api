import { Module } from '@nestjs/common';
import { FolderElementService } from './folder-element.service';
import { FolderElementController } from './folder-element.controller';

@Module({
  providers: [FolderElementService],
  controllers: [FolderElementController],
})
export class FolderElementModule {}
