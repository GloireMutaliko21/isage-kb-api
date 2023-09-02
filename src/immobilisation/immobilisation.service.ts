import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateImmob } from './dto';
import { Cron } from '@nestjs/schedule';

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
      const immobs = await this.prisma.$queryRaw`
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
      return immobs;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  @Cron('0 0 * * *')
  private async updateVnc() {
    try {
      const immobs = await this.prisma.$queryRaw`
        UPDATE "immobilisations"

        SET 
          vnc = (
            "vnc" - (
              CASE
                WHEN "vnc" = "valDepart" THEN "vnc"/"duration"
                ELSE ("vnc"/("duration" - EXTRACT(year FROM age("createdAt"))))
              END
            )
          ),
          "amortissDate" = NOW()
        
        WHERE 
          CASE
            WHEN "vnc" = "valDepart" THEN
              EXTRACT (year FROM age("createdAt")) >= 1
            ELSE 
              EXTRACT(year FROM age("amortissDate")) >= 1
          END
        ;
      `;
      return immobs;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
