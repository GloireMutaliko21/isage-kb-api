import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @MinLength(3)
  @IsNotEmpty()
  libelle: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  stockAlert: number;

  @IsString()
  @IsNotEmpty()
  unityId: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;
}
