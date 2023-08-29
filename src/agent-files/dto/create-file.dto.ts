import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAgentFileDto {
  @IsString()
  @IsNotEmpty()
  agentId: string;

  @IsString()
  @IsNotEmpty()
  folderElementId: string;
}
