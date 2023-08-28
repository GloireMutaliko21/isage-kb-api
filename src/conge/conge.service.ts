import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCongeDto } from './dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class CongeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailer: MailService,
  ) {}

  private readonly CongeModel = this.prisma.conge;

  async requestConge(agentId: string) {
    const currentDate = new Date();
    const existConge = await this.CongeModel.findFirst({
      where: {
        agentId: agentId,
        OR: [
          {
            endDate: {
              gte: currentDate,
            },
          },
          {
            approved: false,
          },
        ],
      },
    });
    if (existConge)
      throw new ConflictException(
        'You are already in leave or you have another request',
      );

    return this.CongeModel.create({
      data: {
        agentId,
      },
    });
  }

  async approuveConge(dto: CreateCongeDto, congeId: string) {
    const conge = await this.CongeModel.findFirst({
      where: {
        agentId: dto.agentId,
        approved: false,
      },
      include: { agent: true },
    });
    if (!conge) throw new BadRequestException('Approve failed');
    const approvedConge = await this.CongeModel.update({
      data: {
        approved: true,
        ...dto,
      },
      where: {
        id: congeId,
      },
    });

    try {
      this.mailer.sendMail(
        'Congé approuvé',
        conge.agent.email,
        `<div>
        Bonjour <b>${conge.agent.names}</b> ! 
        Après votre demande de congé en date du ${conge.createdAt.toISOString()}, Nous vous informons que votre demande a été approuvée avec les détails suivants : 

        <ul>
          <li>Date de début : <b>${approvedConge.startDate}</b></li>
          <li>Date de fin : <b>${approvedConge.endDate}</b></li>
        </ul>
        
        Nous vous souhaitons un bon répos et à très bientôt ! 🥰
        </div>`,
      );

      return approvedConge;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createConge(dto: CreateCongeDto) {
    const currentDate = new Date();
    const existConge = await this.CongeModel.findFirst({
      where: {
        agentId: dto.agentId,
        endDate: {
          gte: currentDate,
        },
      },
    });
    if (existConge)
      throw new ConflictException('This agent is still in leave ');

    try {
      const conge = await this.CongeModel.create({
        data: { ...dto },
        include: { agent: true },
      });

      this.mailer.sendMail(
        'Congé approuvé',
        conge.agent.email,
        `<div>
        Bonjour <b>${conge.agent.names}</b> ! 
        Nous tenons à vous annoncer que nous vous plaçon en congé en respect des stipulations contractuelles avec les détails suivants : 

        <ul>
          <li>Date de début : <b>${conge.startDate}</b></li>
          <li>Date de fin : <b>${conge.endDate}</b></li>
          </ul>
          
          Nous vous souhaitons un bon répos et à très bientôt ! 🥰
          </div>`,
      );
      return conge;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAgentsOnConge() {
    const currentDate = new Date();

    const agentsOnLeave = await this.CongeModel.findMany({
      where: {
        endDate: {
          gte: currentDate,
        },
      },
      select: {
        agent: true,
      },
    });

    return agentsOnLeave.map((record) => record.agent);
  }
}
