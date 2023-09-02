import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';

import { JwtGuard } from '../auth/guards';
import { RolesGuard } from '../roles/guards';
import { Roles } from '../roles/decorators';
import { Role } from '../roles/enum';
import { ImmobilisationService } from './immobilisation.service';
import { CreateImmob } from './dto';

@UseGuards(JwtGuard, RolesGuard)
@Controller('immob')
@Roles(Role.Admin, Role.DuPatr)
export class ImmobilisationController {
  constructor(private readonly immobService: ImmobilisationService) {}

  @Post()
  createImmob(@Body() dto: CreateImmob) {
    return this.immobService.createImmob(dto);
  }

  @Get()
  getImmobs() {
    return this.immobService.getImmobs();
  }

  @Get('amortis')
  getAmortis() {
    return this.immobService.getAllAmortImmobs();
  }
}
