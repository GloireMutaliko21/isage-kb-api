import {
  IsArray,
  IsOptional,
  IsNumber,
  IsObject,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

class RateDTO {
  @IsNumber()
  @IsOptional()
  base?: number;

  @IsNumber()
  @IsOptional()
  alloc?: number;

  @IsNumber()
  @IsOptional()
  conge?: number;

  @IsNumber()
  @IsOptional()
  ferie?: number;

  @IsNumber()
  @IsOptional()
  maladAcc?: number;

  @IsNumber()
  @IsOptional()
  heureSupp?: number;
}

export class UpdateGradeDto {
  @Length(3, 30)
  @IsString()
  @IsOptional()
  title?: string;

  @IsObject()
  @IsOptional()
  @ValidateNested()
  rate?: RateDTO;

  @IsArray()
  @IsOptional()
  folderIds?: string[];
}
