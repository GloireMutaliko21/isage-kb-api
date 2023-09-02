import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArticleDto } from './dto';

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
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
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
      throw new InternalServerErrorException(error);
    }
  }

  async articlesPerCateg() {
    try {
      return await this.prisma.$queryRaw`
        SELECT 
          categories."libelle" AS categorie,
          array_agg(articles."libelle") AS articles
        FROM articles

        INNER JOIN categories ON
        articles."categoryId" = categories."id"

        GROUP BY categories."libelle";
      `;
    } catch (error) {
      throw new InternalServerErrorException(error);
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
      throw new InternalServerErrorException(error);
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
      });
      return articles;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
