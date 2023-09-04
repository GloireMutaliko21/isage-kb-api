import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SoubscriptionDto } from './dto';

@Injectable()
export class SocCaseSubscriptionService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly SubscriptionModel = this.prisma.casSocSubscription;

  async subscribe(dto: SoubscriptionDto, agentId: string) {
    try {
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
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getSocialCaseSubscriptions(id: string) {
    try {
      return await this.SubscriptionModel.findMany({
        where: { casSocId: id },
        include: {
          casSoc: {
            include: {
              agent: {
                select: { names: true },
              },
            },
          },
          agent: { select: { names: true } },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
