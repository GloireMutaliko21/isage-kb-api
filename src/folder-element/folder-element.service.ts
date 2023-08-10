import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFolderElementDto, UpdateFolderElementDto } from './dto';

@Injectable()
export class FolderElementService {
  constructor(private prisma: PrismaService) {}
  folderElement = this.prisma.folderElement;

  getFolderElements() {
    return this.folderElement.findMany();
  }

  getFolderElementById(folderElementId: string) {
    return this.folderElement.findUnique({ where: { id: folderElementId } });
  }

  async createFolderElement(dto: CreateFolderElementDto) {
    const folderElement = await this.folderElement.create({ data: { ...dto } });
    return folderElement;
  }

  editFolderElement(folderElementId: string, dto: UpdateFolderElementDto) {
    return this.folderElement.update({
      data: { ...dto },
      where: { id: folderElementId },
    });
  }

  async deleteFolderElement(folderElementId: string) {
    await this.folderElement.delete({ where: { id: folderElementId } });
  }
}
