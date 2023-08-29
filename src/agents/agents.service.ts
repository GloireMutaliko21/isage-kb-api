import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as argon from 'argon2';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateAgentDto, UpdateAgentDto, UpdateAgentProfileDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { DefinePasswordAndUsernameDto } from '../auth/dto/auth.dto';

@Injectable()
export class AgentsService {
  constructor(
    private prisma: PrismaService,
    private mailer: MailService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}
  private AgentModel = this.prisma.agent;
  private RoleModel = this.prisma.role;

  getAgents() {
    return this.AgentModel.findMany({
      include: {
        grade: true,
        roles: true,
      },
    });
  }

  async getAgentById(agentId: string) {
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
  }

  async createAgent(dto: CreateAgentDto) {
    const { access_token } = await this.signToken(
      `${new Date()}`,
      dto.email,
      '1d',
    );
    const roleId = await this.RoleModel.findFirst({
      where: { title: 'General access' },
      select: { id: true },
    });
    const existAgent = await this.AgentModel.findFirst({
      where: {
        OR: [{ email: dto.email }, { matricule: dto.matricule }],
      },
    });
    if (existAgent !== null)
      throw new ConflictException('One or more informations already exist');

    try {
      const agent = await this.AgentModel.create({
        data: {
          ...dto,
          resetToken: access_token,
          roles: {
            connect: { id: roleId.id },
          },
        },
      });
      this.mailer.sendMail(
        'Register Success',
        agent.email,
        `<b>Bonjour, Inscription reussie</b><br/><p>Clique sur ce <a href="http://localhost:3000/auth/createpass/${agent.id}?t=${access_token}">lien</a> pour definir votre mot de passe</p>`,
      );
      return agent;
    } catch (error) {
      throw new InternalServerErrorException("Quelque chose s'est mal passé");
    }
  }

  async definePasswordAndUsername(
    dto: DefinePasswordAndUsernameDto,
    email: string,
  ) {
    const hash = await argon.hash(dto.password);
    const agent = await this.AgentModel.findUnique({
      where: { email, resetToken: { not: null } },
    });
    if (!agent) throw new ForbiddenException('Agent could not be found');

    if (dto.password !== dto.confirmPassword)
      throw new BadRequestException(
        'Les deux mots de passe doivent correspondre',
      );
    return this.AgentModel.update({
      data: {
        username: dto.username ?? agent.username,
        password: hash ?? agent.password,
        resetToken: null,
      },
      where: { email },
    });
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
      this.mailer.sendMail('Register Success', agent.email, html);
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
