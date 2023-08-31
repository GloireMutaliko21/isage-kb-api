import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateImmob } from './dto';

@Injectable()
export class ImmobilisationService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly ImmobModel = this.prisma.immobilisation;

  async createImmob(dto: CreateImmob) {
    try {
      return this.ImmobModel.create({
        data: { ...dto, vnc: dto.valDepart },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getImmobs() {
    try {
      return this.ImmobModel.findMany({
        include: {
          category: true,
          service: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAllAmortImmobs() {
    try {
      const biens = await this.prisma.$queryRaw`
         SELECT 

            immobilisations."libelle", 
            immobilisations."createdAt", 
            "valDepart", 
            "duration", 
            "vnc", 
            "amortissDate", 
            services."libelle" as service 

            FROM "immobilisations" 
            
            INNER JOIN services 
            ON "serviceId" = services.id 

            WHERE (
              (
                (
                  DATE_PART('year', 'NOW()'::date) - 
                  DATE_PART('year', immobilisations."createdAt"::date)
                ) * 12 +
                (
                  DATE_PART('month', 'NOW()'::date) - 
                  DATE_PART('month', immobilisations."createdAt"::date)
                )
              ) / 12
            ) >= "duration"
      `;
      return biens;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
