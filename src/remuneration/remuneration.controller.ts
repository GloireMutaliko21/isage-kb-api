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
import {
  CreatePaySlipDto,
  FamilyAllocationDto,
  RemJMaladAccDto,
  SalaryDeductionDto,
  SuppHourDto,
} from './dto';

@UseGuards(JwtGuard, RolesGuard)
@Controller('remuneration')
@Roles(Role.Admin, Role.DuPers)
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
    Controllers for payments of deductions
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

  /*
    Controllers for payments for primes
  */
  @Post('prime')
  registerPrime(@Body() dto: SalaryDeductionDto) {
    return this.remunerationService.registerPrime(dto);
  }

  @Get('prime/:id')
  getPrimeAgent(
    @Param('id') agentId: string,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    return this.remunerationService.getPrimeAgent(agentId, year, month);
  }

  @Get('prime-synth/:id')
  getPrimeLibelle(
    @Param('id') agentId: string,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    return this.remunerationService.getPrimeLibelle(agentId, year, month);
  }

  /*
    Controllers for payments for allocations
  */
  @Post('alloc')
  registerAllocation(@Body() dto: FamilyAllocationDto) {
    return this.remunerationService.registerAllocation(dto);
  }

  @Get('alloc/:id')
  getFamAllocPerAgent(
    @Param('id') agentId: string,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    return this.remunerationService.getFamAllocPerAgent(agentId, year, month);
  }

  /*
    Controllers for payments for supp hours
  */
  @Post('hsupp')
  registerSuppHour(@Body() dto: SuppHourDto) {
    return this.remunerationService.registerSuppHour(dto);
  }
  @Get('hsupp/:id')
  getSuppHourAgent(
    @Param('id') agentId: string,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    return this.remunerationService.getSuppHourAgent(agentId, year, month);
  }

  /*
    Controllers for payments for leave days
  */
  @Post('conge')
  registerRemDaysConge(@Body() dto: FamilyAllocationDto) {
    return this.remunerationService.registerRemDaysConge(dto);
  }
  @Get('conge/:id')
  getRemDaysCongePerAgent(
    @Param('id') agentId: string,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    return this.remunerationService.getRemDaysCongePerAgent(
      agentId,
      year,
      month,
    );
  }

  /*
    Controllers for payments for leave days
  */
  @Post('ferie')
  registerRemDaysFerie(@Body() dto: FamilyAllocationDto) {
    return this.remunerationService.registerRemDaysFerie(dto);
  }
  @Get('ferie/:id')
  getRemDaysFeriePerAgent(
    @Param('id') agentId: string,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    return this.remunerationService.getRemDaysFeriePerAgent(
      agentId,
      year,
      month,
    );
  }

  /*
    Controllers pay slip and pay list
  */

  @Post('payslip')
  registerPaySlip(@Body() dto: CreatePaySlipDto) {
    return this.remunerationService.registerPaySlip(dto);
  }

  @Get('paylist')
  getPayList(
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    return this.remunerationService.getPayList(year, month);
  }

  @Get('unpaid')
  getUnpaidAgents(
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    return this.remunerationService.getUnpaidAgents(year, month);
  }

  @Get('payslip/:id')
  getPaySlipPerAgent(
    @Param('id') agentId: string,
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    return this.remunerationService.getPaySlipPerAgent(agentId, year, month);
  }
}
