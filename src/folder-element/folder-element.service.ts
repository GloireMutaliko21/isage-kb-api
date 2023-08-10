import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
}
