import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { RemJMaladAccDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RemunerationService {
  constructor(private readonly prisma: PrismaService) {}

  // Payment models declaration
  private readonly FichePaieModel = this.prisma.fichePaie;
  private readonly RemJMaladAccModel = this.prisma.remJMaladAcc;
  private readonly SalaryDeductionModel = this.prisma.salaryDeduction;
  private readonly PrimeModel = this.prisma.prime;
  private readonly FamilyAllocationModel = this.prisma.familyAllocation;
  private readonly SuppHourModel = this.prisma.suppHour;
  private readonly RemDaysCongeModel = this.prisma.remDaysConge;
  private readonly RemDaysFerieModel = this.prisma.remDaysFerie;

  /*
    This function returns the rates for each agent's grade
  */

  private async getGradeRate(agentId: string) {
    try {
      const agent = await this.prisma.agent.findUnique({
        where: { id: agentId },
        select: {
          grade: {
            select: { rate: true },
          },
        },
      });
      return agent.grade.rate as Record<string, number>;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /*
    Services for payments for days of accidents and sickness
  */
  registerRemMaladAccid(dto: RemJMaladAccDto) {
    return this.RemJMaladAccModel.create({
      data: dto,
      include: { agent: true },
    });
  }
  // Its return result monthly
  async getRemMaladAccPerAgent(agentId: string, year: number, month: number) {
    const firstDayOfMonth = new Date(`${year}-${month}-01`);
    const lastDayOfMonth = new Date(
      new Date(firstDayOfMonth).setMonth(firstDayOfMonth.getMonth() + 1) - 1,
    );

    try {
      const monthlyMaladAcc = await this.RemJMaladAccModel.findMany({
        where: {
          agentId,
          createdAt: {
            gte: firstDayOfMonth.toISOString(),
            lte: lastDayOfMonth.toISOString(),
          },
        },
      });
      const rate = await this.getGradeRate(agentId);
      let days: any = 0;
      let total: any = 0;
      monthlyMaladAcc.forEach((rem) => {
        const remDays = rem.days.toNumber();
        days += remDays;
        total += remDays * rate.maladAcc;
      });
      console.log(typeof days);
      return {
        days: (days as number) || 0,
        total: total || 0,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
