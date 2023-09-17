import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsString,
  Length,
} from 'class-validator';

export class CreateGradeDto {
  @Length(3, 30)
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  baseSalary: number;

  @IsObject()
  @IsNotEmpty()
  rate: Record<string, number>;

  @IsArray()
  @IsNotEmpty()
  folderIds: string[];
}
