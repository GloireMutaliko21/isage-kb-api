import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCatgoryDto } from '../property-category/dto';

@Injectable()
export class ArticleUnityService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly UnityModel = this.prisma.unity;

  async createUnity(dto: CreateCatgoryDto) {
    try {
      const isExists = await this.UnityModel.findFirst({
        where: { libelle: dto.libelle },
      });
      if (isExists)
        throw new ConflictException('Unity with this libelle already exists');
      return await this.UnityModel.create({
        data: dto,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getUnities() {
    try {
      return this.UnityModel.findMany({
        include: {
          articles: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getUnityById(id: string) {
    try {
      const unity = await this.UnityModel.findUnique({
        where: { id },
        include: {
          articles: true,
        },
      });
      if (!unity) throw new ForbiddenException('Unity with this id not found');

      return unity;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateUnity(dto: CreateCatgoryDto, id: string) {
    try {
      const isExists = await this.UnityModel.findFirst({
        where: { libelle: dto.libelle },
      });
      if (isExists)
        throw new ConflictException('Unity with this libelle already exists');
      const unity = await this.UnityModel.findUnique({
        where: { id },
      });
      if (!unity) throw new ForbiddenException('Unity with this id not found');
      return await this.UnityModel.update({
        data: dto,
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
