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
import { Role } from '../roles/enum';
import { Roles } from '../roles/decorators';
import { ServiceSectionService } from './service-section.service';
import { CreateCatgoryDto } from '../property-category/dto';

@UseGuards(JwtGuard, RolesGuard)
@Controller('service')
@Roles(Role.Admin, Role.DuPers)
export class ServiceSectionController {
  constructor(private readonly sectionService: ServiceSectionService) {}

  @Post()
  createService(@Body() dto: CreateCatgoryDto) {
    return this.sectionService.createService(dto);
  }

  @Get()
  getServices() {
    return this.sectionService.getServices();
  }

  @Get(':id')
  getServiceById(@Param('id') id: string) {
    return this.sectionService.getServiceById(id);
  }

  @Patch(':id')
  updateService(@Body() dto: CreateCatgoryDto, @Param('id') id: string) {
    return this.sectionService.updateService(dto, id);
  }
}
