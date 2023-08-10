import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FolderElementModule } from './folder-element/folder-element.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FolderElementModule,
    PrismaModule,
  ],
})
export class AppModule {}
