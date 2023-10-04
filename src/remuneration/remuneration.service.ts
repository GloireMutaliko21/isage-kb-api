import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePaySlipDto,
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
            select: { rate: true, baseSalary: true },
          },
          nbChildren: true,
        },
      });
      return {
        baseSalaty: agent.grade.baseSalary,
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
        total += remDays * rate.ferie;
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
    Fiche et liste de paie et situations paie
  */

  async registerPaySlip(dto: CreatePaySlipDto) {
    const { year, month, agentId } = dto;
    const existPaySlip = await this.FichePaieModel.findFirst({
      where: {
        month: `${year}-${month}`,
        agentId: dto.agentId,
      },
    });

    if (existPaySlip)
      throw new ConflictException('This agent is already paied for this month');
    try {
      const rates = await this.getGradeRate(agentId);

      const primesData = await this.getPrimeLibelle(agentId, year, month);
      const primesFormattedData = {};

      const deductionsData = await this.getSalDeducPerAgentLibelle(
        agentId,
        year,
        month,
      );
      const deductionsFormattedData = {};

      primesData.forEach((prime) => {
        const libelle = prime.libelle;
        const amount = prime._sum.amount.toNumber();

        primesFormattedData[libelle] = amount;
      });

      deductionsData.forEach((deductions) => {
        const libelle = deductions.libelle;
        const amount = deductions._sum.amount;

        deductionsFormattedData[libelle] = amount;
      });

      const paySlip = await this.FichePaieModel.create({
        data: {
          month: `${year}-${month}`,
          baseSalary: {
            base: rates.baseSalaty,
            rate: rates.rate.base,
          },
          supHours: {
            hours: (await this.getSuppHourAgent(agentId, year, month)).hours,
            rate: rates.rate.heureSupp,
          },
          jFeries: {
            days: (
              await this.getRemDaysFeriePerAgent(agentId, year, month)
            ).days,
            rate: rates.rate.ferie,
          },
          jConge: {
            days: (
              await this.getRemDaysCongePerAgent(agentId, year, month)
            ).days,
            rate: rates.rate.conge,
          },
          primes: primesFormattedData,
          deductions: deductionsFormattedData,
          alloc: {
            children: rates.nbEnfant,
            days: (await this.getFamAllocPerAgent(agentId, year, month)).days,
            rate: rates.rate.alloc,
          },
          jMaldAcc: {
            days: (
              await this.getRemMaladAccPerAgent(agentId, year, month)
            ).days,
            rate: rates.rate.maladAcc,
          },
          agentId,
        },
        include: {
          agent: {
            include: {
              grade: true,
            },
          },
        },
      });
      return paySlip;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getPaySlipAll(start: any, end: any) {
    try {
      const paySlip = await this.FichePaieModel.groupBy({
        where: {
          createdAt: {
            gte: start,
            lte: end,
          },
        },
        by: ['month'],
        _count: true,
      });
      if (!paySlip)
        return {
          message: 'No data',
          data: {},
        };
      const formatted = paySlip.map(({ month, _count }) => {
        const mois = month.substring(month.indexOf('-') + 1, month.length);
        return {
          mois:
            mois.length < 2
              ? month.substring(0, month.indexOf('-') + 1) + 0 + mois
              : month,
          total: _count,
        };
      });
      return formatted;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getPaySlipPerAgent(agentId: string, year: number, month: number) {
    try {
      const paySlip = await this.FichePaieModel.findFirst({
        where: {
          agentId,
          month: `${year}-${month}`,
        },
        include: { agent: true },
      });
      if (!paySlip)
        return {
          message: 'Agent not paid for this month',
          data: {},
        };
      return paySlip;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getPayList(year: number, month: number) {
    try {
      const payList = await this.FichePaieModel.findMany({
        select: {
          baseSalary: true,
          supHours: true,
          jFeries: true,
          jConge: true,
          primes: true,
          deductions: true,
          alloc: true,
          jMaldAcc: true,
          agent: {
            select: {
              names: true,
              grade: {
                select: { title: true },
              },
            },
          },
        },
        where: { month: `${year}-${month}` },
      });
      if (!payList)
        throw new BadRequestException('None pay slip founded for this month');

      const formattedPayList = payList.map((paySlip) => {
        const salary = paySlip.baseSalary as Record<string, number>;
        const suppHours = paySlip.supHours as Record<string, number>;
        const ferie = paySlip.jFeries as Record<string, number>;
        const conge = paySlip.jConge as Record<string, number>;
        const primes = paySlip.primes as Record<string, number>;
        const deductions = paySlip.deductions as Record<string, number>;
        const alloc = paySlip.alloc as Record<string, number>;
        const maladie = paySlip.jMaldAcc as Record<string, number>;
        return {
          names: paySlip.agent.names,
          grade: paySlip.agent.grade.title,
          salary: salary?.base * salary?.rate,
          suppHours: suppHours?.hours * suppHours?.rate,
          ferie: ferie?.days * ferie?.rate,
          conge: conge?.days * conge?.rate,
          primes: Object.values(primes).reduce((a, r) => a + r, 0),
          deduction: Object.values(deductions).reduce((a, r) => a + r, 0),
          alloc: alloc?.rate * alloc?.days * alloc?.children,
          maladie: maladie?.days * maladie?.rate,
        };
      });
      return formattedPayList;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getUnpaidAgents(year: number, month: number) {
    const firstDayOfMonth = new Date(`${year}-${month}-01`);
    const lastDayOfMonth = new Date(
      new Date(firstDayOfMonth).setMonth(firstDayOfMonth.getMonth() + 1) - 1,
    );
    try {
      const paidAgents = await this.FichePaieModel.findMany({
        select: { agentId: true },
        where: { month: `${year}-${month}` },
      });
      const agents = await this.prisma.agent.findMany({
        where: {
          NOT: {
            id: {
              in: paidAgents.map((r) => r.agentId),
            },
          },
        },
        select: {
          id: true,
          names: true,
          grade: {
            select: {
              title: true,
              baseSalary: true,
              rate: true,
            },
          },
          primes: {
            select: { amount: true },
            where: {
              createdAt: {
                gte: firstDayOfMonth.toISOString(),
                lte: lastDayOfMonth.toISOString(),
              },
            },
          },
          suppHours: {
            select: { number: true },
            where: {
              createdAt: {
                gte: firstDayOfMonth.toISOString(),
                lte: lastDayOfMonth.toISOString(),
              },
            },
          },
          remJMaladAccs: {
            select: { days: true },
            where: {
              createdAt: {
                gte: firstDayOfMonth.toISOString(),
                lte: lastDayOfMonth.toISOString(),
              },
            },
          },
          remJoursConges: {
            select: { days: true },
            where: {
              createdAt: {
                gte: firstDayOfMonth.toISOString(),
                lte: lastDayOfMonth.toISOString(),
              },
            },
          },
          remJoursFerie: {
            select: { days: true },
            where: {
              createdAt: {
                gte: firstDayOfMonth.toISOString(),
                lte: lastDayOfMonth.toISOString(),
              },
            },
          },
          salaryDeductions: {
            select: { amount: true },
            where: {
              createdAt: {
                gte: firstDayOfMonth.toISOString(),
                lte: lastDayOfMonth.toISOString(),
              },
            },
          },
          familyAllocations: {
            select: { days: true },
            where: {
              createdAt: {
                gte: firstDayOfMonth.toISOString(),
                lte: lastDayOfMonth.toISOString(),
              },
            },
          },
        },
      });
      if (agents.length < 1)
        throw new ForbiddenException('All agents already paid');
      return agents;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
