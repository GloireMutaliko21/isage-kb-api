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

export class CreateAgentDto {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  names: string;

  @IsString()
  @IsNotEmpty()
  matricule: string;

  @IsString()
  @IsNotEmpty()
  sex: string;

  @IsString()
  @IsNotEmpty()
  function: string;

  @IsString()
  @IsNotEmpty()
  status: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  birthDate: Date;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  engagDate: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  promDate?: Date;

  @IsString()
  @IsNotEmpty()
  acadTitle: string;

  @IsNumber()
  @IsNotEmpty()
  sifa: number;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsObject()
  @IsNotEmpty()
  contacts: Record<string, any>;

  @IsString()
  @IsOptional()
  imgUrl?: string;

  @IsString()
  @IsOptional()
  public_id?: string;

  @IsString()
  @IsOptional()
  resetToken?: string;

  @IsString()
  @IsNotEmpty()
  gradeId: string;
}
