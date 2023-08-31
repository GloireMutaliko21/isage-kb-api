import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCatgoryDto } from '../property-category/dto';

@Injectable()
export class ServiceSectionService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly ServiceModel = this.prisma.service;

  async createService(dto: CreateCatgoryDto) {
    try {
      const isExists = await this.ServiceModel.findFirst({
        where: { libelle: dto.libelle },
      });
      if (isExists)
        throw new ConflictException('Service with this libelle already exists');
      return await this.ServiceModel.create({
        data: dto,
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getServices() {
    try {
      return this.ServiceModel.findMany({
        include: {
          immobilisations: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getServiceById(id: string) {
    try {
      const service = await this.ServiceModel.findUnique({
        where: { id },
        include: {
          immobilisations: true,
        },
      });
      if (!service)
        throw new ForbiddenException('Service with this id not found');

      return service;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateService(dto: CreateCatgoryDto, id: string) {
    try {
      const isExists = await this.ServiceModel.findFirst({
        where: { libelle: dto.libelle },
      });
      if (isExists)
        throw new ConflictException('Service with this libelle already exists');
      const service = await this.ServiceModel.findUnique({
        where: { id },
      });
      if (!service)
        throw new ForbiddenException('Service with this id not found');
      return await this.ServiceModel.update({
        data: dto,
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
