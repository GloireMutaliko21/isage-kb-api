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
