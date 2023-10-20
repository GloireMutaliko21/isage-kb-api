import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFolderElementDto, UpdateFolderElementDto } from './dto';

@Injectable()
export class FolderElementService {
  constructor(private readonly prisma: PrismaService) {}
  private readonly FolderElementModel = this.prisma.folderElement;

  async getFolderElements() {
    try {
      return await this.FolderElementModel.findMany({
        include: { agents: true },
      });
    } catch (error) {
      throw new InternalServerErrorException(error, { cause: error });
    }
  }

  async getFolderElementById(folderElementId: string) {
    try {
      const folderEmt = await this.FolderElementModel.findUnique({
        where: { id: folderElementId },
        include: { agents: true },
      });
      if (!folderEmt)
        throw new ForbiddenException('Element could not be found');
      return folderEmt;
    } catch (error) {
      throw new InternalServerErrorException(error, { cause: error });
    }
  }

  async createFolderElement(dto: CreateFolderElementDto) {
    try {
      const folderElement = await this.FolderElementModel.create({
        data: { ...dto },
      });
      return folderElement;
    } catch (error) {
      throw new InternalServerErrorException(error, { cause: error });
    }
  }

  async editFolderElement(
    folderElementId: string,
    dto: UpdateFolderElementDto,
  ) {
    try {
      const folderEmt = await this.FolderElementModel.findUnique({
        where: { id: folderElementId },
      });
      if (!folderEmt)
        throw new ForbiddenException('Element could not be found');
      return await this.FolderElementModel.update({
        data: { ...dto },
        where: { id: folderElementId },
      });
    } catch (error) {
      throw new InternalServerErrorException(error, { cause: error });
    }
  }

  async deleteFolderElement(folderElementId: string) {
    try {
      const folderEmt = await this.FolderElementModel.findUnique({
        where: { id: folderElementId },
      });
      if (!folderEmt)
        throw new ForbiddenException('Element could not be found');
      return await this.FolderElementModel.delete({
        where: { id: folderElementId },
      });
    } catch (error) {
      throw new InternalServerErrorException(error, { cause: error });
    }
  }
}
