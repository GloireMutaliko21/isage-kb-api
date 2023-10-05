import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
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

export class UpdateArticleDto {
  @IsString()
  @MinLength(3)
  @IsOptional()
  libelle?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  stockAlert?: number;

  @IsString()
  @IsOptional()
  unityId?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;
}
