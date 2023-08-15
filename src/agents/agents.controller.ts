import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dto';

@Controller('agents')
export class AgentsController {
  constructor(private agentService: AgentsService) {}

  @Get()
  getAgents() {
    return this.agentService.getAgents();
  }

  @Get(':id')
  getAgentById(@Param('id') agentId: string) {
    return this.agentService.getAgentById(agentId);
  }

  @Post()
  createAgent(@Body() dto: CreateAgentDto) {
    return this.agentService.createAgent(dto);
  }
}
