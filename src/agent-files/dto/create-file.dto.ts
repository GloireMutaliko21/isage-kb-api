import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateAgentFileDto {
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsString()
  @IsNotEmpty()
  agentId: string;

  @IsString()
  @IsNotEmpty()
  folderElementId: string;
}
