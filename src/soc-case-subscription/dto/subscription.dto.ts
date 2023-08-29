import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class SoubscriptionDto {
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  montant: number;

  @IsString()
  @IsNotEmpty()
  casSocId: string;
}
