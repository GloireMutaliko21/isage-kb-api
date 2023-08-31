import { Module } from '@nestjs/common';
import { PropertyCategoryService } from './property-category.service';
import { PropertyCategoryController } from './property-category.controller';

@Module({
  providers: [PropertyCategoryService],
  controllers: [PropertyCategoryController]
})
export class PropertyCategoryModule {}
