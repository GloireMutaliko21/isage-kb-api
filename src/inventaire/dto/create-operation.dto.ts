import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateOperationDto {
  @IsString()
  @IsNotEmpty()
  typeOp: string;

  @IsString()
  @IsNotEmpty()
  libelle: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  qty: number;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  dateOp: Date;

  @IsString()
  @IsNotEmpty()
  articleId: string;
}
