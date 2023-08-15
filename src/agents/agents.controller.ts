import { Body, Controller, Post } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dto';

@Controller('agents')
export class AgentsController {
  constructor(private agentService: AgentsService) {}

  @Post()
  createAgent(@Body() dto: CreateAgentDto) {
    return this.agentService.createAgent(dto);
  }
}
