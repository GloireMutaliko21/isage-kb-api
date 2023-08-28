import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AttendencyService } from './attendency.service';
import { JwtGuard } from '../auth/guards';
import { RolesGuard } from '../roles/guards';
import { Roles } from '../roles/decorators';
import { Role } from '../roles/enum';
import { GetUser } from '../auth/decorators';
import { CreateAttendencyDto } from './dto';

@UseGuards(JwtGuard, RolesGuard)
@Controller('attendency')
export class AttendencyController {
  constructor(private readonly attendencyService: AttendencyService) {}

  @Get()
  @Roles(Role.Admin, Role.DuPers)
  getDailyAttendencies() {
    return this.attendencyService.getDailyAttendencies();
  }

  @Get('monthly')
  @Roles(Role.Admin, Role.DuPatr)
  getMonthlyAttendencie(
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
  ) {
    return this.attendencyService.getMonthlyGobalAttendency(year, month);
  }

  @Get('agent-monthly')
  @Roles(Role.Admin, Role.DuPers)
  getMonthlyAttendenciePerAgent(
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
    @Body('agentId') agentId: string,
  ) {
    return this.attendencyService.getMonthlyGobalAttendencyPerAgent(
      year,
      month,
      agentId,
    );
  }

  @Get('monthly-me')
  getAgentOwnMonthly(
    @Query('year', ParseIntPipe) year: number,
    @Query('month', ParseIntPipe) month: number,
    @GetUser('id') agentId: string,
  ) {
    return this.attendencyService.getMonthlyGobalAttendencyPerAgent(
      year,
      month,
      agentId,
    );
  }

  @Post()
  createAttendency(@Body() dto: CreateAttendencyDto) {
    return this.attendencyService.createAttendency(dto);
  }
}
