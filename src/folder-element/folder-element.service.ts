import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFolderElementDto, UpdateFolderElementDto } from './dto';

@Injectable()
export class FolderElementService {
  constructor(private prisma: PrismaService) {}
  folderElement = this.prisma.folderElement;

  getFolderElements() {
    return this.folderElement.findMany({ include: { agents: true } });
  }

  async getFolderElementById(folderElementId: string) {
    const folderEmt = await this.folderElement.findUnique({
      where: { id: folderElementId },
      include: { agents: true },
    });
    if (!folderEmt) throw new ForbiddenException('Element could not be found');
    return folderEmt;
  }

  async createFolderElement(dto: CreateFolderElementDto) {
    const folderElement = await this.folderElement.create({ data: { ...dto } });
    return folderElement;
  }

  async editFolderElement(
    folderElementId: string,
    dto: UpdateFolderElementDto,
  ) {
    const folderEmt = await this.folderElement.findUnique({
      where: { id: folderElementId },
    });
    if (!folderEmt) throw new ForbiddenException('Element could not be found');
    return this.folderElement.update({
      data: { ...dto },
      where: { id: folderElementId },
    });
  }

  async deleteFolderElement(folderElementId: string) {
    const folderEmt = await this.folderElement.findUnique({
      where: { id: folderElementId },
    });
    if (!folderEmt) throw new ForbiddenException('Element could not be found');
    return this.folderElement.delete({ where: { id: folderElementId } });
  }
}
