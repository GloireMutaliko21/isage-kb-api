import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FolderElementModule } from './folder-element/folder-element.module';
import { PrismaModule } from './prisma/prisma.module';
import { GradesModule } from './grades/grades.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FolderElementModule,
    GradesModule,
    PrismaModule,
  ],
})
export class AppModule {}
