import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateAgentFileDto {
  @IsUrl()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  agentId?: string;

  @IsString()
  @IsOptional()
  folderElementId?: string;
}
