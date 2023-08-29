import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateAgentFileDto {
  @IsString()
  @IsNotEmpty()
  public_id: string;

  @IsString()
  @IsNotEmpty()
  agentId: string;

  @IsString()
  @IsNotEmpty()
  folderElementId: string;
}
