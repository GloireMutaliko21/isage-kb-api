import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateGradeDto, UpdateGradeDto } from './dto';

@Injectable()
export class GradesService {
  constructor(private prisma: PrismaService) {}
  GradeModel = this.prisma.grade;

  getGrades() {
    return this.GradeModel.findMany({ include: { agents: true } });
  }

  async getGradeById(gradeId: string) {
    const grade = await this.GradeModel.findUnique({
      where: { id: gradeId },
      include: { agents: true },
    });
    if (!grade) throw new ForbiddenException('Grade could not be found');
    return grade;
  }

  async createGrade(dto: CreateGradeDto) {
    const grade = await this.GradeModel.create({
      data: { ...dto },
    });
    return grade;
  }

  async editGrade(gradeId: string, dto: UpdateGradeDto) {
    const grade = await this.GradeModel.findUnique({
      where: { id: gradeId },
    });
    if (!grade) throw new ForbiddenException('Grade could not be found');
    return this.GradeModel.update({
      data: { ...dto },
      where: { id: gradeId },
      include: { agents: true },
    });
  }

  async deleteGrade(gradeId: string) {
    const grade = await this.GradeModel.findUnique({
      where: { id: gradeId },
    });
    if (!grade) throw new ForbiddenException('Grade could not be found');
    return this.GradeModel.delete({ where: { id: gradeId } });
  }
}
