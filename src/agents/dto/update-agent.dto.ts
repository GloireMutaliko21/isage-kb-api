import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateAgentDto {
  @IsString()
  @IsOptional()
  gradeId?: string;

  @IsString()
  @IsOptional()
  matricule?: string;

  @IsString()
  @IsOptional()
  function?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  engagDate?: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  promDate?: Date;

  @IsString()
  @IsOptional()
  acadTitle?: string;

  @IsString()
  @IsOptional()
  sifa?: string;
}

export class UpdateAgentProfileDto {
  @IsString()
  @IsOptional()
  names?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  sex?: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  bithDate?: Date;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsObject()
  @IsOptional()
  contacts?: Record<string, any>;

  @IsString()
  @IsOptional()
  imgUrl?: string;

  @IsString()
  @IsOptional()
  public_id?: string;
}
