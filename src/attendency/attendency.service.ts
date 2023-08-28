import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { PrismaService } from '../prisma/prisma.service';
import { CreateAttendencyDto } from './dto';

@Injectable()
export class AttendencyService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly AttendencyModel = this.prisma.presence;

  /* 
    Service to point every moorning attendency for agents on leave with status "en conge"
  */
  @Cron(CronExpression.MONDAY_TO_FRIDAY_AT_8AM)
  private async attendenceAgentsInConge() {
    const currentDate = new Date();

    const agentsWithPresenceIds = (await this.getDailyAttendencies()).map(
      (presence) => presence.agentId,
    );

    const agentsOnLeave = await this.prisma.conge.findMany({
      where: {
        endDate: {
          gte: currentDate,
        },
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
    console.log('Attendencies created');
    return this.AttendencyModel.createMany({ data });
  }

  /* 
    Service to point agent attendency
  */
  async createAttendency(dto: CreateAttendencyDto) {
    const date = new Date(dto.dateNow);

    let status: string;

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
            gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
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
    return await this.AttendencyModel.create({
      data: {
        agentId: dto.agentId,
        status,
      },
    });
  }

  /* 
    Service to get daily attendency status"
  */
  getDailyAttendencies() {
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
    return this.AttendencyModel.findMany({
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
  }

  /* 
    Service to get monthly attendency status"
  */
  getMonthlyGobalAttendency(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return this.AttendencyModel.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      include: {
        agent: true,
      },
    });
  }

  /* 
    Service to get monthly attendency status per agent"
  */
  getMonthlyGobalAttendencyPerAgent(
    year: number,
    month: number,
    agentId: string,
  ) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    return this.AttendencyModel.findMany({
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
  }

  /* 
    Service to point every moorning attendency for not present agents
  */
  @Cron(CronExpression.MONDAY_TO_FRIDAY_AT_10PM)
  private async createAbsences() {
    const agentsWithPresenceIds = (await this.getDailyAttendencies()).map(
      (presence) => presence.agentId,
    );

    const currentDate = new Date();
    const agentsOnConge = await this.prisma.conge.findMany({
      where: {
        endDate: {
          gte: currentDate,
        },
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
  }
}
