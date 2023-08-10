import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FolderElementModule } from './folder-element/folder-element.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), FolderElementModule],
})
export class AppModule {}
