import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateFolderElementDto {
  @Length(5, 30)
  @IsString()
  @IsNotEmpty()
  title: string;
}
