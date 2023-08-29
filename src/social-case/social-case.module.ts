import { Module } from '@nestjs/common';
import { SocialCaseService } from './social-case.service';
import { SocialCaseController } from './social-case.controller';

@Module({
  providers: [SocialCaseService],
  controllers: [SocialCaseController]
})
export class SocialCaseModule {}
