import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SoubscriptionDto } from './dto';

@Injectable()
export class SocCaseSubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly SubscriptionModel = this.prisma.casSocSubscription;

  async subscribe(dto: SoubscriptionDto, agentId: string) {
    const subscription = await this.SubscriptionModel.create({
      data: {
        ...dto,
        agentId,
      },
    });
    if (!subscription)
      throw new InternalServerErrorException('Subscription failed');

    const deduction = await this.prisma.salaryDeduction.create({
      data: {
        amount: dto.montant,
        libelle: 'Cas sociaux',
        agentId,
      },
    });
    return { subscription, deduction };
  }

  getSocialCaseSubscriptions(id: string) {
    return this.SubscriptionModel.findMany({
      where: { id },
      include: {
        casSoc: {
          select: { endDate: true },
          include: {
            agent: {
              select: { names: true },
            },
          },
        },
        agent: { select: { names: true } },
      },
    });
  }
}
