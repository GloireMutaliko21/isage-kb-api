import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { RemJMaladAccDto, SalaryDeductionDto } from './dto';
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
  async registerRemMaladAccid(dto: RemJMaladAccDto) {
    try {
      return await this.RemJMaladAccModel.create({
        data: dto,
        include: { agent: true },
      });
    } catch (error) {
      return new InternalServerErrorException(error);
    }
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
      return {
        days: (days as number) || 0,
        total: total || 0,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /*
    Services for payments for salary deductions
  */
  async registerSalaryDeduction(dto: SalaryDeductionDto) {
    try {
      return await this.SalaryDeductionModel.create({
        data: dto,
        include: { agent: true },
      });
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  async getSalDeducPerAgent(agentId: string, year: number, month: number) {
    const firstDayOfMonth = new Date(`${year}-${month}-01`);
    const lastDayOfMonth = new Date(
      new Date(firstDayOfMonth).setMonth(firstDayOfMonth.getMonth() + 1) - 1,
    );

    try {
      const monthlyMaladAcc = await this.SalaryDeductionModel.findMany({
        where: {
          agentId,
          createdAt: {
            gte: firstDayOfMonth.toISOString(),
            lte: lastDayOfMonth.toISOString(),
          },
        },
      });
      let total: any = 0;
      monthlyMaladAcc.forEach((rem) => {
        total += rem.amount.toNumber();
      });
      return {
        total: total || 0,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getSalDeducPerAgentLibelle(
    agentId: string,
    year: number,
    month: number,
  ) {
    const firstDayOfMonth = new Date(`${year}-${month}-01`);
    const lastDayOfMonth = new Date(
      new Date(firstDayOfMonth).setMonth(firstDayOfMonth.getMonth() + 1) - 1,
    );

    try {
      const monthlyMaladAcc = await this.SalaryDeductionModel.groupBy({
        by: 'libelle',
        where: {
          agentId,
          createdAt: {
            gte: firstDayOfMonth.toISOString(),
            lte: lastDayOfMonth.toISOString(),
          },
        },
        _sum: {
          amount: true,
        },
      });
      let total: any = 0;
      monthlyMaladAcc.forEach((rem) => {
        total += rem._sum.amount;
      });
      return {
        total: total || 0,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
