import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto, UpdateArticleDto } from './dto';

@Injectable()
export class ArticleService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly ArticleModel = this.prisma.article;

  async createArticle(dto: CreateArticleDto) {
    try {
      const isExists = await this.ArticleModel.findFirst({
        where: { libelle: dto.libelle },
      });
      if (isExists)
        throw new ConflictException('Article with this libelle already exists');
      return await this.ArticleModel.create({
        data: dto,
        include: {
          category: {
            select: { libelle: true },
          },
          unity: {
            select: { libelle: true },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error, { cause: error });
    }
  }

  async updateArticle(dto: UpdateArticleDto, id: string) {
    try {
      const isExists = await this.ArticleModel.findUnique({
        where: { id },
      });
      if (!isExists) throw new ForbiddenException('Article could not be found');
      return await this.ArticleModel.update({
        data: dto,
        where: { id },
        include: {
          category: {
            select: { libelle: true },
          },
          unity: {
            select: { libelle: true },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error, { cause: error });
    }
  }

  async getArticles() {
    try {
      return await this.ArticleModel.findMany({
        include: {
          category: {
            select: { libelle: true },
          },
          unity: {
            select: { libelle: true },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error, { cause: error });
    }
  }

  async articlesPerCateg() {
    try {
      // With prisma, all category will be returned
      // return await this.prisma.category.findMany({
      //   select: {
      //     libelle: true,
      //     articles: {
      //       select: {
      //         libelle: true,
      //         qty: true,
      //       },
      //     },
      //   },
      //   orderBy: {
      //     libelle: 'asc',
      //   },
      // });

      // SQL Query only categorie with at least one article
      return await this.prisma.$queryRaw`
        SELECT 
          categories."libelle" AS categorie,
          json_agg(
            json_build_object(
              'libelle', articles."libelle", 
              'qte', articles."qty",
              'stockAlert', articles."stockAlert",
              'unity', unities."libelle"
            )
          ) AS articles
        FROM articles

        INNER JOIN categories ON
        articles."categoryId" = categories."id"
        INNER JOIN unities ON
        articles."unityId" = unities."id"

        GROUP BY categories."libelle";
      `;
    } catch (error) {
      throw new InternalServerErrorException(error, { cause: error });
    }
  }

  async getArticleById(id: string) {
    try {
      const article = await this.ArticleModel.findUnique({
        where: { id },
        include: {
          category: {
            select: { libelle: true },
          },
          unity: {
            select: { libelle: true },
          },
        },
      });
      if (!article) throw new ForbiddenException('Article could not be found');
      return article;
    } catch (error) {
      throw new InternalServerErrorException(error, { cause: error });
    }
  }

  async getUnstockeArticles() {
    try {
      const articles = await this.ArticleModel.findMany({
        where: {
          stockAlert: {
            gt: this.ArticleModel.fields.qty,
          },
        },
        include: {
          category: {
            select: { libelle: true },
          },
          unity: {
            select: { libelle: true },
          },
        },
      });
      return articles;
    } catch (error) {
      throw new InternalServerErrorException(error, { cause: error });
    }
  }
}
