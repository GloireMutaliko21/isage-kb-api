import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto, UpdateRoleDto } from './dto';

@Controller('roles')
export class RolesController {
  constructor(private roleService: RolesService) {}

  @Get()
  getRoles() {
    return this.roleService.getRoles();
  }

  @Get(':id')
  getFolderElementById(@Param('id') roleId: string) {
    return this.roleService.getRoleById(roleId);
  }

  @Post()
  createFolderElement(@Body() dto: CreateRoleDto) {
    return this.roleService.createRole(dto);
  }

  @Patch(':id')
  editFolderElement(@Body() dto: UpdateRoleDto, @Param('id') roleId: string) {
    return this.roleService.editRole(roleId, dto);
  }

  @Patch('access/:id')
  createAccess(@Param('id') agentId: string, @Body('roleId') roleId: string) {
    return this.roleService.createAccess(roleId, agentId);
  }

  @Patch('access/rm/:id')
  removeAccess(@Param('id') agentId: string, @Body('roleId') roleId: string) {
    return this.roleService.removeAccess(roleId, agentId);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteFolderElement(@Param('id') roleId: string) {
    return this.roleService.deleteRole(roleId);
  }
}
