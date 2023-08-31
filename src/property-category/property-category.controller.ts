import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { Role } from '../roles/enum';
import { Roles } from '../roles/decorators';
import { JwtGuard } from '../auth/guards';
import { RolesGuard } from '../roles/guards';
import { PropertyCategoryService } from './property-category.service';
import { CreateCatgoryDto } from './dto';

@UseGuards(JwtGuard, RolesGuard)
@Controller('category')
@Roles(Role.Admin, Role.DuPatr)
export class PropertyCategoryController {
  constructor(private readonly categoryService: PropertyCategoryService) {}

  @Post()
  createCategory(@Body() dto: CreateCatgoryDto) {
    return this.categoryService.createCategory(dto);
  }

  @Get()
  getCategories() {
    return this.categoryService.getCategories();
  }

  @Get(':id')
  getCategoryById(@Param('id') id: string) {
    return this.categoryService.getCategoryById(id);
  }

  @Patch(':id')
  updateCategory(@Body() dto: CreateCatgoryDto, @Param('id') id: string) {
    return this.categoryService.updateCategory(dto, id);
  }
}
