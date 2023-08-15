import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import crypto from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateAgentDto, UpdateAgentDto, UpdateAgentProfileDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AgentsService {
  constructor(
    private prisma: PrismaService,
    private mailer: MailService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}
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
    try {
      const { access_token } = await this.signToken(
        new Date().toLocaleDateString(),
        dto.email,
        '1d',
      );
      const agent = await this.AgentModel.create({
        data: {
          ...dto,
          resetToken: access_token,
        },
      });
      this.mailer.sendMail(
        agent.email,
        `<b>Bonjour, Inscription reussie</b><br/><p>Clique sur ce <a href="http://localhost:3000/auth/createpass/${agent.id}?t=${access_token}">lien</a> pour definir votre mot de passe</p>`,
      );
      return agent;
    } catch (error) {
      throw new InternalServerErrorException("Quelque chose s'est mal passé");
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

  public async signToken(
    userId: string,
    email: string,
    expireesIn: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get<string>('JWT_SECRET_KEY');
    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: expireesIn,
      secret,
    });

    return {
      access_token,
    };
  }

  // async updateProfile(dto: UpdateAgentProfileDto, agentId: string): Promise<any> {

  // }
}
