import { Module } from '@nestjs/common';
import { AgentFilesService } from './agent-files.service';
import { AgentFilesController } from './agent-files.controller';

@Module({
  providers: [AgentFilesService],
  controllers: [AgentFilesController],
})
export class AgentFilesModule {}
