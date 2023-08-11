import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateRoleDto {
  @IsString()
  @Length(5, 30)
  title: string;
}
