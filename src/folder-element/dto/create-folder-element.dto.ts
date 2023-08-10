import { IsString, Length } from 'class-validator';

export class CreateFolderElementDto {
  @IsString()
  @Length(5, 30)
  title: string;
}
