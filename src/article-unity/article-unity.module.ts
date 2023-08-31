import { Module } from '@nestjs/common';
import { ArticleUnityService } from './article-unity.service';
import { ArticleUnityController } from './article-unity.controller';

@Module({
  providers: [ArticleUnityService],
  controllers: [ArticleUnityController]
})
export class ArticleUnityModule {}
