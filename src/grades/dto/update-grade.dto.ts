import {
  IsArray,
  IsOptional,
  IsObject,
  IsString,
  Length,
  IsNumber,
} from 'class-validator';

export class UpdateGradeDto {
  @Length(3, 30)
  @IsString()
  @IsOptional()
  title?: string;

  @IsNumber()
  @IsOptional()
  baseSalary?: number;

  @IsObject()
  @IsOptional()
  rate?: Record<string, number>;

  @IsArray()
  @IsOptional()
  folderIds?: string[];
}
