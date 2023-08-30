import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import {
  FamilyAllocationDto,
  RemJMaladAccDto,
  SalaryDeductionDto,
  SuppHourDto,
} from './dto';

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
          nbChildren: true,
        },
      });
      return {
        rate: agent.grade.rate as Record<string, number>,
        nbEnfant: agent.nbChildren,
      };
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
      const rate = (await this.getGradeRate(agentId)).rate;
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
      const monthlyDeduc = await this.SalaryDeductionModel.findMany({
        where: {
          agentId,
          createdAt: {
            gte: firstDayOfMonth.toISOString(),
            lte: lastDayOfMonth.toISOString(),
          },
        },
      });
      let total: any = 0;
      monthlyDeduc.forEach((rem) => {
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
      const monthlyDeduc = await this.SalaryDeductionModel.groupBy({
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
      return monthlyDeduc;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /*
    Services for payments for primes
  */
  async registerPrime(dto: SalaryDeductionDto) {
    try {
      return await this.PrimeModel.create({
        data: dto,
        include: { agent: true },
      });
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  async getPrimeAgent(agentId: string, year: number, month: number) {
    const firstDayOfMonth = new Date(`${year}-${month}-01`);
    const lastDayOfMonth = new Date(
      new Date(firstDayOfMonth).setMonth(firstDayOfMonth.getMonth() + 1) - 1,
    );

    try {
      const monthlyPrime = await this.PrimeModel.findMany({
        where: {
          agentId,
          createdAt: {
            gte: firstDayOfMonth.toISOString(),
            lte: lastDayOfMonth.toISOString(),
          },
        },
      });
      let total: any = 0;
      monthlyPrime.forEach((rem) => {
        total += rem.amount.toNumber();
      });
      return {
        total: total || 0,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getPrimeLibelle(agentId: string, year: number, month: number) {
    const firstDayOfMonth = new Date(`${year}-${month}-01`);
    const lastDayOfMonth = new Date(
      new Date(firstDayOfMonth).setMonth(firstDayOfMonth.getMonth() + 1) - 1,
    );

    try {
      const monthlyPrime = await this.PrimeModel.groupBy({
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
      return monthlyPrime;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /*
    Services for payments for family allocations
  */
  async registerAllocation(dto: FamilyAllocationDto) {
    try {
      return await this.FamilyAllocationModel.create({
        data: dto,
        include: { agent: true },
      });
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  async getFamAllocPerAgent(agentId: string, year: number, month: number) {
    const firstDayOfMonth = new Date(`${year}-${month}-01`);
    const lastDayOfMonth = new Date(
      new Date(firstDayOfMonth).setMonth(firstDayOfMonth.getMonth() + 1) - 1,
    );

    try {
      const monthlyMaladAcc = await this.FamilyAllocationModel.findMany({
        where: {
          agentId,
          createdAt: {
            gte: firstDayOfMonth.toISOString(),
            lte: lastDayOfMonth.toISOString(),
          },
        },
        include: {
          agent: {
            select: {
              nbChildren: true,
            },
          },
        },
      });
      const agentParams = await this.getGradeRate(agentId);
      let days: any = 0;
      let total: any = 0;
      monthlyMaladAcc.forEach((rem) => {
        const remDays = rem.days.toNumber();
        days += remDays;
        total += remDays * agentParams.rate.alloc;
      });
      return {
        days: (days as number) || 0,
        nbEnfant: agentParams.nbEnfant.toNumber(),
        total: total * agentParams.nbEnfant.toNumber() || 0,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /*
    Services for payments for supp hours
  */
  async registerSuppHour(dto: SuppHourDto) {
    try {
      return await this.SuppHourModel.create({
        data: dto,
        include: { agent: true },
      });
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  async getSuppHourAgent(agentId: string, year: number, month: number) {
    const firstDayOfMonth = new Date(`${year}-${month}-01`);
    const lastDayOfMonth = new Date(
      new Date(firstDayOfMonth).setMonth(firstDayOfMonth.getMonth() + 1) - 1,
    );

    try {
      const monthlySuppHours = await this.SuppHourModel.findMany({
        where: {
          agentId,
          createdAt: {
            gte: firstDayOfMonth.toISOString(),
            lte: lastDayOfMonth.toISOString(),
          },
        },
      });
      const rate = (await this.getGradeRate(agentId)).rate;
      let hours: any = 0;
      let total: any = 0;
      monthlySuppHours.forEach((rem) => {
        const remHours = rem.number.toNumber();
        hours += remHours;
        total += remHours * rate.heureSupp;
      });
      return {
        hours: (hours as number) || 0,
        total: total || 0,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /*
    Services for payments for leave days
  */
  async registerRemDaysConge(dto: FamilyAllocationDto) {
    try {
      return await this.RemDaysCongeModel.create({
        data: dto,
        include: { agent: true },
      });
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }
  // Its return result monthly
  async getRemDaysCongePerAgent(agentId: string, year: number, month: number) {
    const firstDayOfMonth = new Date(`${year}-${month}-01`);
    const lastDayOfMonth = new Date(
      new Date(firstDayOfMonth).setMonth(firstDayOfMonth.getMonth() + 1) - 1,
    );

    try {
      const monthlyDaysConge = await this.RemDaysCongeModel.findMany({
        where: {
          agentId,
          createdAt: {
            gte: firstDayOfMonth.toISOString(),
            lte: lastDayOfMonth.toISOString(),
          },
        },
      });
      const rate = (await this.getGradeRate(agentId)).rate;
      let days: any = 0;
      let total: any = 0;
      monthlyDaysConge.forEach((rem) => {
        const remDays = rem.days.toNumber();
        days += remDays;
        total += remDays * rate.conge;
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
    Services for payments for jours feries
  */
  async registerRemDaysFerie(dto: FamilyAllocationDto) {
    try {
      return await this.RemDaysFerieModel.create({
        data: dto,
        include: { agent: true },
      });
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }
  // Its return result monthly
  async getRemDaysFeriePerAgent(agentId: string, year: number, month: number) {
    const firstDayOfMonth = new Date(`${year}-${month}-01`);
    const lastDayOfMonth = new Date(
      new Date(firstDayOfMonth).setMonth(firstDayOfMonth.getMonth() + 1) - 1,
    );

    try {
      const monthlyDaysFerie = await this.RemDaysFerieModel.findMany({
        where: {
          agentId,
          createdAt: {
            gte: firstDayOfMonth.toISOString(),
            lte: lastDayOfMonth.toISOString(),
          },
        },
      });
      const rate = (await this.getGradeRate(agentId)).rate;
      let days: any = 0;
      let total: any = 0;
      monthlyDaysFerie.forEach((rem) => {
        const remDays = rem.days.toNumber();
        days += remDays;
        total += remDays * rate.conge;
      });
      return {
        days: (days as number) || 0,
        total: total || 0,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
