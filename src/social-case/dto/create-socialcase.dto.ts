import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, MinLength, IsDate } from 'class-validator';

export class CreateSocialCaseDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  description: string;

  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  endDate: Date;
}
