import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AgentsService } from './agents.service';
import { CreateAgentDto, UpdateAgentDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { DefinePasswordAndUsernameDto } from '../auth/dto';
import { GetUser } from '../auth/decorators';
import { JwtGuard } from '../auth/guards';

@UseGuards(JwtGuard)
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

  @Get('profile')
  getAgentProfile(@GetUser('id') agentId: string) {
    return this.agentService.getAgentById(agentId);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post()
  async createAgent(
    @Body() dto: CreateAgentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    let imgUrl = '';
    let public_id = '';
    if (file) {
      const fileInfos = await this.cloudinaryService.upload(
        file,
        'AgentsProfiles',
      );
      imgUrl = fileInfos.secure_url;
      public_id = fileInfos.public_id;
    }
    return this.agentService.createAgent({
      ...dto,
      imgUrl,
      public_id,
    });
  }

  @Post('profile/pwd')
  definePasswordAndUsername(
    @Body() dto: DefinePasswordAndUsernameDto,
    @GetUser('email') userEmail: string,
  ) {
    return this.agentService.definePasswordAndUsername(dto, userEmail);
  }

  @Patch(':id')
  updateAgent(@Param('id') agentId: string, @Body() dto: UpdateAgentDto) {
    return this.agentService.updateAgent(dto, agentId);
  }
}
