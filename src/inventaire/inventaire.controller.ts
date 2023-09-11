import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { JwtGuard } from '../auth/guards';
import { RolesGuard } from '../roles/guards';
import { Roles } from '../roles/decorators';
import { Role } from '../roles/enum';
import { InventaireService } from './inventaire.service';
import { CreateOperationDto } from './dto';
import { ParseDatePipe } from '../utils/parse-date.pipe';

@UseGuards(JwtGuard, RolesGuard)
@Controller('inventaire')
@Roles(Role.Admin, Role.DuPatr)
export class InventaireController {
  constructor(private readonly inventaireService: InventaireService) {}

  @Post()
  createOperation(@Body() dto: CreateOperationDto) {
    return this.inventaireService.createOperation(dto);
  }

  @Get('today')
  getTodayStockSheet() {
    return this.inventaireService.getTodayStockSheet();
  }

  @Get('week')
  getThisWeekStockSheet() {
    return this.inventaireService.getThisWeekStockSheet();
  }

  @Get('synthese')
  getMonthSynthese() {
    return this.inventaireService.getMonthSynthese();
  }

  @Get()
  getGlobalHistoric(
    @Query('start', ParseDatePipe) start: string,
    @Query('end', ParseDatePipe) end: string,
  ) {
    return this.inventaireService.getGlobalHistoric(start, end);
  }

  @Get(':id')
  getGlobalHistoricByArticle(
    @Param('id') id: string,
    @Query('start', ParseDatePipe) start: string,
    @Query('end', ParseDatePipe) end: string,
  ) {
    return this.inventaireService.getGlobalHistoricByArticle(start, end, id);
  }
}
