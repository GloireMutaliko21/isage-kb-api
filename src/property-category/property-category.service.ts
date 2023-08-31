import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCatgoryDto } from './dto';

@Injectable()
export class PropertyCategoryService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly CategoryModel = this.prisma.category;

  async createCategory(dto: CreateCatgoryDto) {
    try {
      const isExists = await this.CategoryModel.findFirst({
        where: { libelle: dto.libelle },
      });
      if (isExists)
        throw new ConflictException(
          'Category with this libelle already exists',
        );
      return await this.CategoryModel.create({
        data: dto,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getCategories() {
    try {
      return await this.CategoryModel.findMany({
        include: {
          immobilisations: true,
          articles: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getCategoryById(id: string) {
    try {
      const category = await this.CategoryModel.findUnique({
        where: { id },
        include: {
          articles: true,
          immobilisations: true,
        },
      });
      if (!category)
        throw new ForbiddenException('Category with this id not found');

      return category;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateCategory(dto: CreateCatgoryDto, id: string) {
    try {
      const isExists = await this.CategoryModel.findFirst({
        where: { libelle: dto.libelle },
      });
      if (isExists)
        throw new ConflictException(
          'Category with this libelle already exists',
        );
      const category = await this.CategoryModel.findUnique({
        where: { id },
      });
      if (!category)
        throw new ForbiddenException('Category with this id not found');
      return await this.CategoryModel.update({
        data: dto,
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
