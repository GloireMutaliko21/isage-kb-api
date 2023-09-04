import { PrismaService } from '../prisma/prisma.service';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateGradeDto, UpdateGradeDto } from './dto';

@Injectable()
export class GradesService {
  constructor(private prisma: PrismaService) {}
  private GradeModel = this.prisma.grade;

  async getGrades() {
    try {
      return await this.GradeModel.findMany({ include: { agents: true } });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getGradeById(gradeId: string) {
    try {
      const grade = await this.GradeModel.findUnique({
        where: { id: gradeId },
        include: { agents: true },
      });
      if (!grade) throw new ForbiddenException('Grade could not be found');
      return grade;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createGrade(dto: CreateGradeDto) {
    try {
      const grade = await this.GradeModel.create({
        data: { ...dto },
      });
      return grade;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async editGrade(gradeId: string, dto: UpdateGradeDto) {
    try {
      const grade = await this.GradeModel.findUnique({
        where: { id: gradeId },
      });
      if (!grade) throw new ForbiddenException('Grade could not be found');
      const folderIds = grade.folderIds as string[];
      let folderIdsToAdd: string[];
      if (dto.folderIds) {
        folderIdsToAdd = dto.folderIds.filter(
          (folderId) => !folderIds.includes(folderId),
        );
      }

      return await this.GradeModel.update({
        data: { ...dto, folderIds: folderIds.concat(folderIdsToAdd) },
        where: { id: gradeId },
        include: { agents: true },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
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
      throw new InternalServerErrorException(error);
    }
  }
}
