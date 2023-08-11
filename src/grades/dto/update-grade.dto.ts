import {
  IsArray,
  IsOptional,
  IsObject,
  IsString,
  Length,
} from 'class-validator';

export class UpdateGradeDto {
  @Length(3, 30)
  @IsString()
  @IsOptional()
  title?: string;

  @IsObject()
  @IsOptional()
  rate?: Record<string, number>;

  @IsArray()
  @IsOptional()
  folderIds?: string[];
}
