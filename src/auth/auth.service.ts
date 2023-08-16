import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';

import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto';
import { AgentsService } from '../agents/agents.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly agentService: AgentsService,
  ) {}

  private readonly AgentModel = this.prisma.agent;

  async login(dto: LoginDto) {
    try {
      const agent = await this.AgentModel.findUnique({
        where: { email: dto.email },
        include: {
          roles: true,
        },
      });

      if (!agent) throw new UnauthorizedException('Invalid auth infos');
      const matchesPwd = await argon.verify(agent.password, dto.password);
      if (!matchesPwd) throw new UnauthorizedException('Invalid auth infos');

      return {
        message: 'Connexion success',
        user: agent,
        token: this.agentService.signToken(agent.id, agent.email, '15d'),
      };
    } catch (error) {}
  }
}
