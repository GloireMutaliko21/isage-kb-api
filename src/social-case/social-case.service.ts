import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSocialCaseDto, UpdateSocialCaseDto } from './dto';

@Injectable()
export class SocialCaseService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly CasSocModel = this.prisma.casSoc;

  private currentDate = new Date();

  createSocialCase(dto: CreateSocialCaseDto, agentId: string) {
    return this.CasSocModel.create({
      data: { ...dto, agentId },
      include: { agent: true },
    });
  }

  getAllSocialsCase() {
    return this.CasSocModel.findMany({
      where: {
        endDate: {
          gte: this.currentDate,
        },
        validity: 'inProgress',
      },
      include: {
        agent: true,
        casSocSubscriptions: true,
      },
    });
  }

  getPubInProgSocialCase(agentId: string) {
    return this.CasSocModel.findMany({
      where: {
        OR: [
          {
            AND: [
              {
                endDate: {
                  gte: this.currentDate,
                },
              },
              {
                status: 'published',
              },
              {
                validity: 'inProgress',
              },
            ],
          },
          {
            agentId,
            validity: 'inProgress',
          },
        ],
      },
      include: {
        agent: true,
        casSocSubscriptions: true,
      },
    });
  }

  async updateSocialCase(dto: UpdateSocialCaseDto, id: string) {
    const socialCase = await this.CasSocModel.findUnique({
      where: { id },
    });
    if (!socialCase)
      throw new ForbiddenException('Social case could not be found');
    return this.CasSocModel.update({
      data: dto,
      where: { id },
      include: {
        agent: true,
        casSocSubscriptions: true,
      },
    });
  }

  async publishSocialCase(id: string) {
    const socialCase = await this.CasSocModel.findUnique({
      where: { id },
    });
    if (!socialCase)
      throw new ForbiddenException('Social case could not be found');
    return this.CasSocModel.update({
      data: { status: 'published' },
      where: { id },
    });
  }

  async closeSocialCase(id: string) {
    const socialCase = await this.CasSocModel.findUnique({
      where: { id },
    });
    if (!socialCase)
      throw new ForbiddenException('Social case could not be found');
    return this.CasSocModel.update({
      data: { validity: 'closed' },
      where: { id },
      include: {
        agent: true,
        casSocSubscriptions: true,
      },
    });
  }
}
