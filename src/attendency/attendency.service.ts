import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { PrismaService } from '../prisma/prisma.service';
import { CreateAttendencyDto } from './dto';
import { deleteKeys } from '../utils/delete-agent-porperties';

@Injectable()
export class AttendencyService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly AttendencyModel = this.prisma.presence;

  /* 
    Service to point every moorning attendency for agents on leave with status "en conge"
  */
  @Cron('0 8 * * 1-5')
  private async attendenceAgentsInConge() {
    const currentDate = new Date();

    try {
      const agentsWithPresenceIds = (await this.getDailyAttendencies()).map(
        (presence) => presence.agentId,
      );

      const agentsOnLeave = await this.prisma.conge.findMany({
        where: {
          endDate: {
            gte: currentDate,
          },
          approved: true,
          agentId: {
            notIn: agentsWithPresenceIds,
          },
        },
        select: {
          agent: true,
        },
      });
      if (!agentsOnLeave) return;

      const data = agentsOnLeave.map((record) => ({
        agentId: record.agent.id,
        status: 'en conge',
      }));
      return this.AttendencyModel.createMany({ data });
    } catch (error) {
      throw new InternalServerErrorException(error, { cause: error });
    }
  }

  /* 
    Service to point agent attendency
  */
  async createAttendency(dto: CreateAttendencyDto) {
    const date = new Date(dto.dateNow);

    let status: string;
    try {
      if (8 < date.getHours()) {
        status = 'retard';
      } else {
        if (date.getMinutes() > 30) status = 'leger retard';
        else status = 'present';
      }

      const attendencies = await this.AttendencyModel.findMany({
        where: {
          AND: {
            agentId: dto.agentId,
            createdAt: {
              gte: new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
              ),
              lt: new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate() + 1,
              ),
            },
          },
        },
      });
      if (attendencies.length > 0)
        throw new ForbiddenException('Algent already pointed');
      else
        return await this.AttendencyModel.create({
          data: {
            agentId: dto.agentId,
            status,
          },
          include: {
            agent: true,
          },
        });
    } catch (error) {
      throw new InternalServerErrorException(error, { cause: error });
    }
  }

  /* 
    Service to get daily attendency status"
  */
  async getDailyAttendencies() {
    const date = new Date();
    const startOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    const endOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1,
    );
    try {
      const attendency = await this.AttendencyModel.findMany({
        where: {
          createdAt: {
            gte: startOfDay,
            lt: endOfDay,
          },
        },
        include: {
          agent: true,
        },
      });
      attendency.forEach((a) =>
        deleteKeys(a.agent, ['password', 'resetToken']),
      );
      return attendency;
    } catch (error) {
      throw new InternalServerErrorException(error, { cause: error });
    }
  }

  /* 
    Service to get monthly attendency status"
  */
  async getMonthlyGobalAttendency(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);
    try {
      const attendency = await this.AttendencyModel.findMany({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          agent: true,
        },
      });
      attendency.forEach((a) =>
        deleteKeys(a.agent, ['password', 'resetToken']),
      );
      return attendency;
    } catch (error) {
      throw new InternalServerErrorException(error, { cause: error });
    }
  }

  /* 
    Service to get monthly attendency status per agent"
  */
  async getMonthlyGobalAttendencyPerAgent(
    year: number,
    month: number,
    agentId: string,
  ) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    try {
      const attendency = await this.AttendencyModel.findMany({
        where: {
          agentId,
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },
        include: {
          agent: true,
        },
      });
      attendency.forEach((a) =>
        deleteKeys(a.agent, ['password', 'resetToken']),
      );
      return attendency;
    } catch (error) {
      throw new InternalServerErrorException(error, { cause: error });
    }
  }

  /* 
    Service to point every moorning attendency for not present agents
  */
  @Cron('0 10 * * 1-5')
  private async createAbsences() {
    try {
      const agentsWithPresenceIds = (await this.getDailyAttendencies()).map(
        (presence) => presence.agentId,
      );

      const currentDate = new Date();
      const agentsOnConge = await this.prisma.conge.findMany({
        where: {
          endDate: {
            gte: currentDate,
          },
          approved: true,
        },
        select: {
          agent: true,
        },
      });
      const agentsOnLeaveIds = agentsOnConge.map((agent) => agent.agent.id);

      const agentsWithoutPresence = await this.prisma.agent.findMany({
        where: {
          AND: [
            {
              id: {
                notIn: agentsWithPresenceIds,
              },
            },
            {
              id: {
                notIn: agentsOnLeaveIds,
              },
            },
          ],
        },
      });
      const data = agentsWithoutPresence.map((record) => ({
        agentId: record.id,
        status: 'absent',
      }));
      return this.AttendencyModel.createMany({ data });
    } catch (error) {
      throw new InternalServerErrorException(error, { cause: error });
    }
  }
}
