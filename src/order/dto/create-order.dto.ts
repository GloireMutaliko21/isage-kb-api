import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateOrderDto {
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  qty: string;

  @IsString()
  @IsNotEmpty()
  articleId: string;
}
