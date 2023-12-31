import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateFolderElementDto {
  @IsString()
  @Length(5, 30)
  @IsOptional()
  title?: string;
}
