import { Type } from 'class-transformer';
import { IsDate, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateSocialCaseDto {
  @IsString()
  @IsOptional()
  @MinLength(20)
  description?: string;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  endDate?: Date;
}
