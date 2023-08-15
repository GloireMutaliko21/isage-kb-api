import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AgentsService } from './agents.service';
import { CreateAgentDto, UpdateAgentDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Controller('agents')
export class AgentsController {
  constructor(
    private readonly agentService: AgentsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get()
  getAgents() {
    return this.agentService.getAgents();
  }

  @Get(':id')
  getAgentById(@Param('id') agentId: string) {
    return this.agentService.getAgentById(agentId);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async createAgent(
    @Body() dto: CreateAgentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let imgUrl = '';
    if (file) {
      const fileInfos = await this.cloudinaryService.upload(
        file,
        'AgentsProfiles',
      );
      imgUrl = fileInfos.secure_url;
    }
    return this.agentService.createAgent({
      ...dto,
    });
  }

  @Patch(':id')
  updateAgent(@Param('id') agentId: string, @Body() dto: UpdateAgentDto) {
    return this.agentService.updateAgent(dto, agentId);
  }
}
