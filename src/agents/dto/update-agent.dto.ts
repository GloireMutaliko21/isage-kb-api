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
  matricule?: string;

  @IsString()
  @IsOptional()
  function?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsDate()
  @IsOptional()
  engagDate?: Date;

  @IsDate()
  @IsOptional()
  promDate?: Date;

  @IsString()
  @IsOptional()
  acadTitle?: string;

  @IsNumber()
  @IsOptional()
  sifa?: number;
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
}
