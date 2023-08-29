import {
  Body,
  Controller,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards';
import { RolesGuard } from '../roles/guards';
import { Roles } from '../roles/decorators';
import { Role } from '../roles/enum';
import { AgentFilesService } from './agent-files.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateAgentFileDto, UpdateAgentFileDto } from './dto';

@UseGuards(JwtGuard, RolesGuard)
@Controller('agent-files')
@Roles(Role.Admin, Role.DuPers)
export class AgentFilesController {
  constructor(
    private readonly fileService: AgentFilesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async createAgentFile(
    @Body() dto: CreateAgentFileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let imgUrl = '';
    let public_id = '';

    if (file) {
      const fileInfos = await this.cloudinaryService.upload(
        file,
        `AgentsFolders/${dto.agentId}`,
      );
      imgUrl = fileInfos.secure_url;
      public_id = fileInfos.public_id;
    }
    return this.fileService.createAgentFile(dto, imgUrl, public_id);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Patch()
  async updateAgentFile(
    @Body() dto: UpdateAgentFileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let imgUrl = '';
    let public_id = '';
    if (file) {
      const fileInfos = await this.cloudinaryService.upload(
        file,
        `AgentsFolders/${dto.agentId}`,
      );
      imgUrl = fileInfos.secure_url;
      public_id = fileInfos.public_id;

      await this.cloudinaryService.delete(dto.public_id);
    }
    return this.fileService.updateAgentFile(dto, imgUrl, public_id);
  }
}
