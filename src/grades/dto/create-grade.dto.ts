import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';

class RateDTO {
  @IsNumber()
  @IsNotEmpty()
  base: number;

  @IsNumber()
  @IsNotEmpty()
  alloc: number;

  @IsNotEmpty()
  @IsNumber()
  conge: number;

  @IsNumber()
  @IsNotEmpty()
  ferie: number;

  @IsNumber()
  @IsNotEmpty()
  maladAcc: number;

  @IsNumber()
  @IsNotEmpty()
  heureSupp: number;
}

export class CreateGradeDto {
  @Length(3, 30)
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsObject()
  @ValidateNested()
  @IsNotEmpty()
  rate: RateDTO;

  @IsArray()
  @IsNotEmpty()
  folderIds: string[];
}
