import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateAgentFileDto {
  @IsString()
  @IsOptional()
  public_id?: string;

  @IsString()
  @IsNotEmpty()
  agentId: string;

  @IsString()
  @IsNotEmpty()
  folderElementId: string;

  @IsOptional()
  file?: any;
}
