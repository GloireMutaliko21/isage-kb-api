import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOperationDto } from './dto';

@Injectable()
export class InventaireService {
  constructor(private readonly prisma: PrismaService) {}

  async createOperation(dto: CreateOperationDto) {
    try {
      // Find article for, after create operation, update its quantity
      const article = await this.prisma.article.findUnique({
        where: { id: dto.articleId },
        select: {
          qty: true,
          id: true,
        },
      });
      if (!article) throw new ForbiddenException('Article could not be found');

      // For out op, check quantity
      const articleQty = article.qty.toNumber();
      if (dto.typeOp !== 'entry' && dto.qty > articleQty)
        throw new BadRequestException('Quantity requested unavailable');

      // Update article quantity and register operation
      const newQty =
        dto.typeOp === 'entry' ? articleQty + dto.qty : articleQty - dto.qty;
      delete dto.articleId;
      return await this.prisma.article.update({
        where: { id: article.id },
        data: {
          qty: newQty,
          operations: {
            create: {
              ...dto,
            },
          },
        },
        include: {
          operations: {
            take: 1,
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getTodayStockSheet() {
    try {
      const stockSheet = await this.prisma.$queryRaw`
        SELECT 
          "typeOp",
          json_agg(
            json_build_object(
              'designation', articles."libelle",
              'libelle', operations."libelle",
              'qte', operations."qty",
              'date', operations."dateOp"
            )
          ) AS data
        FROM operations

        INNER JOIN articles ON 
        operations."articleId" = articles."id"
        
        WHERE DATE("dateOp") = CURRENT_DATE

        GROUP BY "typeOp"
        ORDER BY "typeOp" ASC;
      `;
      return stockSheet;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getThisWeekStockSheet() {
    try {
      const stockSheet = await this.prisma.$queryRaw`
        SELECT
          "typeOp",
          json_agg(
          json_build_object(
            'date', "dateOp",
            'designation', articles."libelle",
            'libelle', operations."libelle",
            'qte', operations."qty"
          )
        ) AS data
      FROM
        operations
      INNER JOIN
        articles ON operations."articleId" = articles."id"
      WHERE
        EXTRACT(week FROM "dateOp") = EXTRACT(week FROM NOW())
      AND 
        EXTRACT(year FROM "dateOp") = EXTRACT(year FROM NOW())
      GROUP BY "typeOp"
      ORDER BY "typeOp" ASC;
      `;
      return stockSheet;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getMonthSynthese() {
    try {
      const stockSheet = await this.prisma.$queryRaw`
        SELECT
          a."libelle",
          SUM(CASE WHEN o."typeOp" = 'entry' THEN o."qty" ELSE 0 END) AS entree,
          SUM(CASE WHEN o."typeOp" = 'out' THEN o."qty" ELSE 0 END) AS sortie,
          a."qty"
        FROM
          articles a
        LEFT JOIN
          operations o ON a."id" = o."articleId"
        WHERE 
          EXTRACT(MONTH FROM o."dateOp") = EXTRACT(MONTH FROM NOW())
        AND 
          EXTRACT(YEAR FROM o."dateOp") = EXTRACT(YEAR FROM NOW())
        GROUP BY
          a."libelle", a."qty";
      `;
      return stockSheet;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getGlobalDashboardHistoric(start: any, end: any) {
    try {
      const stockSheet = await this.prisma.$queryRaw`
        SELECT
          o."typeOp",
          json_agg(
            json_build_object(
              'date', o."dateOp",
              'libelle', o."libelle",
              'qte', o."qty",
              'designation', a."libelle"
            )
          ) AS data
        FROM
          articles a
        LEFT JOIN
          operations o ON a."id" = o."articleId"
        WHERE
          o."dateOp" BETWEEN ${start} AND ${end}
        GROUP BY
          a."libelle", a."qty", o."typeOp"
        ORDER BY
          o."typeOp" ASC;
      `;
      return stockSheet;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getGlobalHistoric(start: any, end: any) {
    try {
      const stockSheet = await this.prisma.$queryRaw`
        SELECT
          o."typeOp",
          json_agg(
            json_build_object(
              'date', o."dateOp",
              'libelle', o."libelle",
              'qte', o."qty",
              'designation', a."libelle"
            )
          ) AS data
        FROM
          articles a
        LEFT JOIN
          operations o ON a."id" = o."articleId"
        WHERE
          o."dateOp" BETWEEN ${start} AND ${end}
        GROUP BY
          o."typeOp"
        ORDER BY
          o."typeOp" ASC;
      `;
      return stockSheet;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getGlobalHistoricByArticle(start: any, end: any, articleId: string) {
    try {
      const stockSheet = await this.prisma.$queryRaw`
        SELECT
          o."typeOp",
          json_agg(
            json_build_object(
              'date', o."dateOp",
              'libelle', o."libelle",
              'qte', o."qty",
              'designation', a."libelle"
            )
          ) AS data
        FROM
          articles a
        LEFT JOIN
          operations o ON a."id" = o."articleId"
        WHERE
          o."dateOp"
            BETWEEN
              ${start}
            AND
              ${end}
          AND
            o."articleId" = ${articleId}
        GROUP BY
          a."libelle", a."qty", o."typeOp"
        ORDER BY
          o."typeOp" ASC;
      `;
      return stockSheet;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
