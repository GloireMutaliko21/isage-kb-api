import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCongeDto } from './dto';
import { MailService } from '../mail/mail.service';
import { calculateNumberOfDays } from '../utils/number-of-days';
import { deleteKeys } from '../utils/delete-agent-porperties';

@Injectable()
export class CongeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailer: MailService,
  ) {}

  private readonly CongeModel = this.prisma.conge;

  async requestConge(agentId: string) {
    const currentDate = new Date();
    try {
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

      return await this.CongeModel.create({
        data: {
          agentId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error, { cause: error });
    }
  }

  async approuveConge(dto: CreateCongeDto, congeId: string) {
    try {
      const conge = await this.CongeModel.findFirst({
        where: {
          id: congeId,
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
        include: {
          agent: {
            include: {
              grade: true,
            },
          },
        },
      });

      await this.prisma.remDaysConge.create({
        data: {
          days: calculateNumberOfDays(
            approvedConge.startDate,
            approvedConge.endDate,
          ),
          agentId: approvedConge.agentId,
        },
      });
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

      deleteKeys(approvedConge.agent, ['password', 'resetToken']);
      return approvedConge;
    } catch (error) {
      throw new InternalServerErrorException(error, { cause: error });
    }
  }

  async createConge(dto: CreateCongeDto) {
    const currentDate = new Date();
    try {
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

      const conge = await this.CongeModel.create({
        data: { ...dto, approved: true },
        include: { agent: true },
      });

      await this.prisma.remDaysConge.create({
        data: {
          days: calculateNumberOfDays(conge.startDate, conge.endDate),
          agentId: conge.agentId,
        },
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
      deleteKeys(conge.agent, ['password', 'resetToken']);
      return conge;
    } catch (error) {
      throw new InternalServerErrorException(error, { cause: error });
    }
  }

  async getAgentsOnConge() {
    const currentDate = new Date();
    try {
      const agentsOnLeave = await this.CongeModel.findMany({
        where: {
          endDate: {
            gte: currentDate,
          },
          startDate: {
            lte: currentDate,
          },
          approved: true,
        },
        select: {
          id: true,
          agentId: true,
          createdAt: true,
          updatedAt: true,
          startDate: true,
          endDate: true,
          approved: true,
          agent: true,
        },
      });

      const agents = agentsOnLeave.map((record) => record.agent);
      agents.forEach((a) => deleteKeys(a, ['password', 'resetToken']));
      return agentsOnLeave;
    } catch (error) {
      throw new InternalServerErrorException(error, { cause: error });
    }
  }

  async getUnapprovedConge() {
    try {
      const records = await this.CongeModel.findMany({
        where: { approved: false },
        include: { agent: true },
      });
      const agents = records.map((record) => record.agent);
      agents.forEach((a) => deleteKeys(a, ['password', 'resetToken']));
      return records;
    } catch (error) {
      throw new InternalServerErrorException(error, { cause: error });
    }
  }

  async getAgentConges(agentId: string) {
    try {
      const leaves = await this.CongeModel.findMany({
        where: { agentId },
        include: {
          agent: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error, { cause: error });
    }
  }
}
