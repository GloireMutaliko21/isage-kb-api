import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/guards';
import { RolesGuard } from '../roles/guards';
import { SocialCaseService } from './social-case.service';
import { CreateSocialCaseDto, UpdateSocialCaseDto } from './dto';
import { GetUser } from '../auth/decorators';
import { Roles } from '../roles/decorators';
import { Role } from '../roles/enum';

@UseGuards(JwtGuard, RolesGuard)
@Controller('social-case')
export class SocialCaseController {
  constructor(private readonly socialCaseService: SocialCaseService) {}

  @Post()
  createSocialCase(
    @Body() dto: CreateSocialCaseDto,
    @GetUser('id') agentId: string,
  ) {
    return this.socialCaseService.createSocialCase(dto, agentId);
  }

  @Get()
  @Roles(Role.Admin, Role.DuPers)
  getAllSocialsCase() {
    return this.socialCaseService.getAllSocialsCase();
  }

  @Get('progress')
  getPubInProgSocialCase(@GetUser('id') agentId: string) {
    return this.socialCaseService.getPubInProgSocialCase(agentId);
  }

  @Get(':id')
  @Roles(Role.Admin, Role.DuPers)
  getOneSocialCase(@Param('id') id: string) {
    return this.socialCaseService.getOneSocialCase(id);
  }

  @Patch(':id')
  @Roles(Role.Admin, Role.DuPers)
  updateSocialCase(@Body() dto: UpdateSocialCaseDto, @Param('id') id: string) {
    return this.socialCaseService.updateSocialCase(dto, id);
  }

  @Patch('pub/:id')
  @Roles(Role.Admin, Role.DuPers)
  publishSocialCase(@Param('id') id: string) {
    return this.socialCaseService.publishSocialCase(id);
  }

  @Patch('close/:id')
  @Roles(Role.Admin, Role.DuPers)
  closeSocialCase(@Param('id') id: string) {
    return this.socialCaseService.closeSocialCase(id);
  }
}
