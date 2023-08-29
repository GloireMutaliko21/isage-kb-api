import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/guards';
import { RolesGuard } from '../roles/guards';
import { SocCaseSubscriptionService } from './soc-case-subscription.service';
import { SoubscriptionDto } from './dto';
import { GetUser } from '../auth/decorators';
import { Roles } from '../roles/decorators';
import { Role } from '../roles/enum';

@UseGuards(JwtGuard, RolesGuard)
@Controller('subscription')
export class SocCaseSubscriptionController {
  constructor(
    private readonly subscriptionService: SocCaseSubscriptionService,
  ) {}

  @Post()
  subscribe(@Body() dto: SoubscriptionDto, @GetUser('id') agentId: string) {
    return this.subscriptionService.subscribe(dto, agentId);
  }

  @Get(':id')
  @Roles(Role.Admin, Role.DuPers)
  getSocialCaseSubscriptions(@Param('id') id: string) {
    return this.subscriptionService.getSocialCaseSubscriptions(id);
  }
}
