import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { RemunerationService } from './remuneration.service';
import { JwtGuard } from '../auth/guards';
import { RolesGuard } from '../roles/guards';
import { Roles } from '../roles/decorators';
import { Role } from '../roles/enum';
import { RemJMaladAccDto, SalaryDeductionDto } from './dto';

@UseGuards(JwtGuard, RolesGuard)
@Controller('remuneration')
@Roles(Role.Admin, Role.DuPatr)
export class RemunerationController {
  constructor(private readonly remunerationService: RemunerationService) {}

  /*
    Controllers for payments for days of accidents and sickness
  */
  @Post('malad')
  registerRemMaladAccid(@Body() dto: RemJMaladAccDto) {
    return this.remunerationService.registerRemMaladAccid(dto);
  }
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

  /*
    Controllers for payments for days of accidents and sickness
  */
  @Post('deduc')
  registerSalaryDeduction(@Body() dto: SalaryDeductionDto) {
    return this.remunerationService.registerSalaryDeduction(dto);
  }

  @Get('deduc/:id')
  getSalDeducPerAgent(
    @Param('id') agentId: string,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    return this.remunerationService.getSalDeducPerAgent(agentId, year, month);
  }

  @Get('deduc-synth/:id')
  getSalDeducPerAgentLibelle(
    @Param('id') agentId: string,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    return this.remunerationService.getSalDeducPerAgentLibelle(
      agentId,
      year,
      month,
    );
  }
}
