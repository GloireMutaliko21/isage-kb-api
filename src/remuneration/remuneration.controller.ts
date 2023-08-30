import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';

import { RemunerationService } from './remuneration.service';
import { JwtGuard } from '../auth/guards';
import { RolesGuard } from '../roles/guards';
import { Roles } from '../roles/decorators';
import { Role } from '../roles/enum';

@UseGuards(JwtGuard, RolesGuard)
@Controller('remuneration')
@Roles(Role.Admin, Role.DuPatr)
export class RemunerationController {
  constructor(private readonly remunerationService: RemunerationService) {}

  @Get('malad/:id')
  getRemMaladAccPerAgent(
    @Param('id') agentId: string,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    return this.remunerationService.getRemMaladAccPerAgent(
      agentId,
      year,
      month,
    );
  }
}
