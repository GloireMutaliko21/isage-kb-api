import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAgentFileDto, UpdateAgentFileDto } from './dto';

@Injectable()
export class AgentFilesService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly FolderModel = this.prisma.folder;

  async createAgentFile(
    dto: CreateAgentFileDto,
    url: string,
    public_id: string,
  ) {
    try {
      const existFile = await this.FolderModel.findFirst({
        where: {
          agentId: dto.agentId,
          folderElementId: dto.folderElementId,
        },
      });
      if (existFile !== null)
        throw new ConflictException('This agent has alredy this file');

      return await this.FolderModel.create({
        data: { ...dto, url, public_id },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateAgentFile(
    dto: UpdateAgentFileDto,
    url: string,
    public_id: string,
  ) {
    try {
      const file = await this.FolderModel.findFirst({
        where: {
          agentId: dto.agentId,
          folderElementId: dto.folderElementId,
        },
      });
      if (!file) throw new ForbiddenException('File could not be found');
      return this.FolderModel.update({
        data: { url, public_id },
        where: {
          agentId_folderElementId: {
            agentId: dto.agentId,
            folderElementId: dto.folderElementId,
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
