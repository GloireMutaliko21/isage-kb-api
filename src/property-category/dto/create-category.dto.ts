import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCatgoryDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  libelle: string;
}
