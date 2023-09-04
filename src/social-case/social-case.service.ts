import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSocialCaseDto, UpdateSocialCaseDto } from './dto';
import { deleteKeys } from '../utils/delete-agent-porperties';

@Injectable()
export class SocialCaseService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly CasSocModel = this.prisma.casSoc;

  private currentDate = new Date();

  async createSocialCase(dto: CreateSocialCaseDto, agentId: string) {
    try {
      const socialCase = await this.CasSocModel.create({
        data: { ...dto, agentId },
        include: { agent: true },
      });
      deleteKeys(socialCase.agent, ['password', 'resetToken']);
      return socialCase;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAllSocialsCase() {
    try {
      const socialCases = await this.CasSocModel.findMany({
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
      socialCases.forEach((s) =>
        deleteKeys(s.agent, ['password', 'resetToken']),
      );
      return socialCases;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getPubInProgSocialCase(agentId: string) {
    try {
      const socialCase = await this.CasSocModel.findMany({
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
      socialCase.forEach((s) =>
        deleteKeys(s.agent, ['password', 'resetToken']),
      );
      return socialCase;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateSocialCase(dto: UpdateSocialCaseDto, id: string) {
    try {
      const socialCase = await this.CasSocModel.findUnique({
        where: { id },
      });
      if (!socialCase)
        throw new ForbiddenException('Social case could not be found');
      const socialCas = await this.CasSocModel.update({
        data: dto,
        where: { id },
        include: {
          agent: true,
          casSocSubscriptions: true,
        },
      });
      deleteKeys(socialCas.agent, ['password', 'resetToken']);
      return socialCas;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async publishSocialCase(id: string) {
    try {
      const socialCase = await this.CasSocModel.findUnique({
        where: { id, status: 'unPublished' },
      });
      if (!socialCase)
        throw new ForbiddenException('Social case could not be found');
      return await this.CasSocModel.update({
        data: { status: 'published' },
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async closeSocialCase(id: string) {
    try {
      const socialCase = await this.CasSocModel.findUnique({
        where: { id, status: 'published' },
      });
      if (!socialCase)
        throw new ForbiddenException('Social case could not be found');
      const socCase = await this.CasSocModel.update({
        data: { validity: 'closed' },
        where: { id },
        include: {
          agent: true,
          casSocSubscriptions: true,
        },
      });
      deleteKeys(socCase.agent, ['password', 'resetToken']);
      return socCase;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
