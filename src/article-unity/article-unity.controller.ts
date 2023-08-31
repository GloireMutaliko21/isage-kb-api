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
import { Roles } from '../roles/decorators';
import { Role } from '../roles/enum';
import { ArticleUnityService } from './article-unity.service';
import { CreateCatgoryDto } from '../property-category/dto';

@UseGuards(JwtGuard, RolesGuard)
@Controller('unity')
@Roles(Role.Admin, Role.DuPatr)
export class ArticleUnityController {
  constructor(private readonly unityService: ArticleUnityService) {}

  @Post()
  createUnity(@Body() dto: CreateCatgoryDto) {
    return this.unityService.createUnity(dto);
  }

  @Get()
  getUnities() {
    return this.unityService.getUnities();
  }

  @Get(':id')
  getUnityById(@Param('id') id: string) {
    return this.unityService.getUnityById(id);
  }

  @Patch(':id')
  updateUnity(@Body() dto: CreateCatgoryDto, @Param('id') id: string) {
    return this.unityService.updateUnity(dto, id);
  }
}
