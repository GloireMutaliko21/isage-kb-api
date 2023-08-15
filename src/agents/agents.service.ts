import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateAgentDto, UpdateAgentDto, UpdateAgentProfileDto } from './dto';

@Injectable()
export class AgentsService {
  constructor(private prisma: PrismaService, private mailer: MailService) {}
  private AgentModel = this.prisma.agent;

  getAgents() {
    return this.AgentModel.findMany({
      include: {
        grade: true,
        roles: true,
      },
    });
  }

  async getAgentById(agentId: string) {
    try {
      const agent = await this.AgentModel.findUnique({
        where: { id: agentId },
        include: {
          grade: true,
          folderElements: true,
          roles: true,
        },
      });
      if (!agent) throw new ForbiddenException('Agent could not be found');
      return agent;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createAgent(dto: CreateAgentDto) {
    const html = `<b>Bonjour, Inscription reussie</b>`;
    try {
      const agent = await this.AgentModel.create({
        data: { ...dto },
      });
      this.mailer.sendMail(agent.email, html);
      return agent;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateAgent(dto: UpdateAgentDto, agentId: string): Promise<any> {
    const html = `<b>Bonjour, certaines de vos informations ont été mises à jour</b>`;

    try {
      const agent = await this.AgentModel.findUnique({
        where: { id: agentId },
        include: {
          grade: true,
          folderElements: true,
          roles: true,
        },
      });
      if (!agent) throw new ForbiddenException('Agent could not be found');
      this.mailer.sendMail(agent.email, html);
      return await this.AgentModel.update({
        where: { id: agentId },
        data: { ...dto },
        include: {
          grade: true,
          folderElements: true,
          roles: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // async updateProfile(dto: UpdateAgentProfileDto, agentId: string): Promise<any> {

  // }
}
