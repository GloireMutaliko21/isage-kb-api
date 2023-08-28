import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateAttendencyDto {
  @Type(() => Date)
  @IsDate()
  @IsNotEmpty()
  dateNow: Date;

  @IsString()
  @IsNotEmpty()
  agentId: string;
}
