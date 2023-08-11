import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateRoleDto {
  @Length(5, 30)
  @IsString()
  @IsNotEmpty()
  title: string;
}

export class CreateAndRemoveAccessDto {
  @Length(36, 36)
  @IsString()
  @IsNotEmpty()
  agentId: string;

  @Length(36, 36)
  @IsString()
  @IsNotEmpty()
  roleId: string;
}
