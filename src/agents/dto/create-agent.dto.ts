import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsObject,
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

  @IsDate()
  @IsNotEmpty()
  birthDate: Date;

  @IsDate()
  @IsNotEmpty()
  engagDate: Date;

  @IsDate()
  @IsNotEmpty()
  promDate?: Date;

  @IsString()
  @IsNotEmpty()
  acadTitle: string;

  @IsNumber()
  @IsNotEmpty()
  sifa: number;

  @IsString()
  @IsNotEmpty()
  username?: string;

  @IsString()
  @IsNotEmpty()
  password?: string;

  @IsObject()
  @IsNotEmpty()
  contacts: Record<string, any>;

  @IsString()
  @IsNotEmpty()
  imgUrl: string;
}
