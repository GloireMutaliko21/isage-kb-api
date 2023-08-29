import { Module } from '@nestjs/common';
import { SocCaseSubscriptionService } from './soc-case-subscription.service';
import { SocCaseSubscriptionController } from './soc-case-subscription.controller';

@Module({
  providers: [SocCaseSubscriptionService],
  controllers: [SocCaseSubscriptionController]
})
export class SocCaseSubscriptionModule {}
