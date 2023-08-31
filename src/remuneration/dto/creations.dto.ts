import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class RemJMaladAccDto {
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  days: number;

  @IsString()
  @IsNotEmpty()
  libelle: string;

  @IsString()
  @IsNotEmpty()
  agentId: string;
}

export class SalaryDeductionDto {
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  libelle: string;

  @IsString()
  @IsNotEmpty()
  agentId: string;
}

export class FamilyAllocationDto {
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  days: number;

  @IsString()
  @IsNotEmpty()
  agentId: string;
}

export class SuppHourDto {
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  number: number;

  @IsString()
  @IsNotEmpty()
  agentId: string;
}

export class CreatePaySlipDto {
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @IsNumber()
  @IsNotEmpty()
  month: number;

  @IsString()
  @IsNotEmpty()
  agentId: string;
}
