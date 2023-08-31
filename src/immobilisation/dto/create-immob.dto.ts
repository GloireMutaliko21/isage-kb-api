import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateImmob {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  libelle: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  valDepart: number;

  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsString()
  @IsNotEmpty()
  serviceId: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;
}
