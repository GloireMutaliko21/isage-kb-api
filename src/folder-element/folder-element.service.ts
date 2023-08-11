import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFolderElementDto, UpdateFolderElementDto } from './dto';

@Injectable()
export class FolderElementService {
  constructor(private prisma: PrismaService) {}
  FolderElementModel = this.prisma.folderElement;

  getFolderElements() {
    return this.FolderElementModel.findMany({ include: { agents: true } });
  }

  async getFolderElementById(folderElementId: string) {
    const folderEmt = await this.FolderElementModel.findUnique({
      where: { id: folderElementId },
      include: { agents: true },
    });
    if (!folderEmt) throw new ForbiddenException('Element could not be found');
    return folderEmt;
  }

  async createFolderElement(dto: CreateFolderElementDto) {
    const folderElement = await this.FolderElementModel.create({
      data: { ...dto },
    });
    return folderElement;
  }

  async editFolderElement(
    folderElementId: string,
    dto: UpdateFolderElementDto,
  ) {
    const folderEmt = await this.FolderElementModel.findUnique({
      where: { id: folderElementId },
    });
    if (!folderEmt) throw new ForbiddenException('Element could not be found');
    return this.FolderElementModel.update({
      data: { ...dto },
      where: { id: folderElementId },
    });
  }

  async deleteFolderElement(folderElementId: string) {
    const folderEmt = await this.FolderElementModel.findUnique({
      where: { id: folderElementId },
    });
    if (!folderEmt) throw new ForbiddenException('Element could not be found');
    return this.FolderElementModel.delete({ where: { id: folderElementId } });
  }
}
