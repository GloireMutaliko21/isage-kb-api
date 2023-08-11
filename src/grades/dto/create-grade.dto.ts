import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsString,
  Length,
} from 'class-validator';

export class CreateGradeDto {
  @Length(3, 30)
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsObject()
  @IsNotEmpty()
  rate: Record<string, number>;

  @IsArray()
  @IsNotEmpty()
  folderIds: string[];
}
