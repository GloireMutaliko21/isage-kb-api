import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { JwtGuard } from '../auth/guards';
import { RolesGuard } from '../roles/guards';
import { Roles } from '../roles/decorators';
import { Role } from '../roles/enum';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dto';

@UseGuards(JwtGuard, RolesGuard)
@Controller('article')
@Roles(Role.Admin, Role.DuPers)
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  createArticle(@Body() dto: CreateArticleDto) {
    return this.articleService.createArticle(dto);
  }

  @Get()
  getArticles() {
    return this.articleService.getArticles();
  }

  @Get('categ')
  articlesPerCateg() {
    return this.articleService.articlesPerCateg();
  }

  @Get('unstock')
  getUnstockeArticles() {
    return this.articleService.getUnstockeArticles();
  }

  @Get(':id')
  getArticleById(@Param('id') id: string) {
    return this.articleService.getArticleById(id);
  }
}
