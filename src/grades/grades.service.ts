import { PrismaService } from '../prisma/prisma.service';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateGradeDto, UpdateGradeDto } from './dto';
import { deleteKeys } from '../utils/delete-agent-porperties';

@Injectable()
export class GradesService {
  constructor(private prisma: PrismaService) {}
  private GradeModel = this.prisma.grade;

  async getGrades() {
    try {
      const grades = await this.GradeModel.findMany({
        include: { agents: true },
      });
      grades.forEach((g) =>
        g.agents.forEach((a) => deleteKeys(a, ['password', 'resetToken'])),
      );
      const returnedGrades = await Promise.all(
        grades.map(async (g) => ({
          ...g,
          folderElements: await this.prisma.folderElement.findMany({
            where: { id: { in: g.folderIds as string[] } },
          }),
        })),
      );
      return returnedGrades;
    } catch (error) {
      throw new InternalServerErrorException(error, { cause: error });
    }
  }

  async getGradeById(gradeId: string) {
    try {
      const grade = await this.GradeModel.findUnique({
        where: { id: gradeId },
        include: { agents: true },
      });
      if (!grade) throw new ForbiddenException('Grade could not be found');
      grade.agents.forEach((a) => deleteKeys(a, ['password', 'resetToken']));
      const folderElements = await this.prisma.folderElement.findMany({
        where: {
          id: {
            in: grade.folderIds as string[],
          },
        },
      });

      return { ...grade, folderElements };
    } catch (error) {
      throw new InternalServerErrorException(error, { cause: error });
    }
  }

  async createGrade(dto: CreateGradeDto) {
    try {
      const grade = await this.GradeModel.create({
        data: { ...dto },
      });
      return grade;
    } catch (error) {
      throw new InternalServerErrorException(error, { cause: error });
    }
  }

  async editGrade(gradeId: string, dto: UpdateGradeDto) {
    try {
      const grade = await this.GradeModel.findUnique({
        where: { id: gradeId },
      });
      if (!grade) throw new ForbiddenException('Grade could not be found');

      const gradeUpdated = await this.GradeModel.update({
        data: dto,
        where: { id: gradeId },
        include: { agents: true },
      });
      gradeUpdated.agents.forEach((a) =>
        deleteKeys(a, ['password', 'resetToken']),
      );
      const folderElements = await this.prisma.folderElement.findMany({
        where: {
          id: {
            in: gradeUpdated.folderIds as string[],
          },
        },
      });
      return { ...gradeUpdated, folderElements };
    } catch (error) {
      throw new InternalServerErrorException(error, { cause: error });
    }
  }

  async deleteGrade(gradeId: string) {
    try {
      const grade = await this.GradeModel.findUnique({
        where: { id: gradeId },
      });
      if (!grade) throw new ForbiddenException('Grade could not be found');
      return await this.GradeModel.delete({ where: { id: gradeId } });
    } catch (error) {
      throw new InternalServerErrorException(error, { cause: error });
    }
  }
}
