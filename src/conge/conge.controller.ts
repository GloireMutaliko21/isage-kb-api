import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards';
import { RolesGuard } from '../roles/guards';
import { CongeService } from './conge.service';
import { GetUser } from '../auth/decorators';
import { CreateCongeDto } from './dto';
import { Roles } from '../roles/decorators';
import { Role } from '../roles/enum';

@UseGuards(JwtGuard, RolesGuard)
@Controller('conge')
export class CongeController {
  constructor(private readonly congeService: CongeService) {}

  @Get()
  @Roles(Role.Admin, Role.DuPers)
  getAgentsOnConge() {
    return this.congeService.getAgentsOnConge();
  }

  @Post()
  @Roles(Role.Admin, Role.DuPers)
  createConge(@Body() dto: CreateCongeDto) {
    return this.congeService.createConge(dto);
  }

  @Post('request')
  requestConge(@GetUser('id') agentId: string) {
    return this.congeService.requestConge(agentId);
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.DuPers)
  approuveConge(@Param('id') congeId: string, @Body() dto: CreateCongeDto) {
    return this.congeService.approuveConge(dto, congeId);
  }
}
