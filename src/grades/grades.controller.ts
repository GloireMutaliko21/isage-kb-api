import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { GradesService } from './grades.service';
import { CreateGradeDto, UpdateGradeDto } from './dto';
import { JwtGuard } from '../auth/guards/jwt.guard';

@UseGuards(JwtGuard)
@Controller('grades')
export class GradesController {
  constructor(private gradeService: GradesService) {}

  @Get()
  getGrades() {
    return this.gradeService.getGrades();
  }

  @Get(':id')
  getGradeById(@Param('id') gradeId: string) {
    return this.gradeService.getGradeById(gradeId);
  }

  @Post()
  createGrade(@Body() dto: CreateGradeDto) {
    return this.gradeService.createGrade(dto);
  }

  @Patch(':id')
  editGrade(@Body() dto: UpdateGradeDto, @Param('id') gradeId: string) {
    return this.gradeService.editGrade(gradeId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteGrade(@Param('id') gradeId: string) {
    return this.gradeService.deleteGrade(gradeId);
  }
}
