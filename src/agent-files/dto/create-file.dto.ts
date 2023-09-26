import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAgentFileDto {
  @IsString()
  @IsNotEmpty()
  agentId: string;

  @IsString()
  @IsNotEmpty()
  folderElementId: string;

  @IsOptional()
  file?: any;
}
