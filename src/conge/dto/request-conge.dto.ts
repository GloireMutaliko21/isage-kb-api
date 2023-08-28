import { IsNotEmpty, IsString } from 'class-validator';

export class RequestCongeDto {
  @IsString()
  @IsNotEmpty()
  agentId: string;
}
