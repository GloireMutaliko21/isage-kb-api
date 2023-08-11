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
  @IsNotEmpty()
  @IsNumber()
  base: number;

  @IsNotEmpty()
  @IsNumber()
  alloc: number;

  @IsNotEmpty()
  @IsNumber()
  conge: number;

  @IsNotEmpty()
  @IsNumber()
  ferie: number;

  @IsNotEmpty()
  @IsNumber()
  maladAcc: number;

  @IsNotEmpty()
  @IsNumber()
  heureSupp: number;
}

export class CreateGradeDto {
  @Length(3, 30)
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsObject()
  @ValidateNested()
  rate: RateDTO;

  @IsArray()
  @IsNotEmpty()
  folderIds: string[];
}
