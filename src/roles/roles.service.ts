import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto, UpdateRoleDto } from './dto';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  private RoleModel = this.prisma.role;
  private AgentModel = this.prisma.agent;

  getRoles() {
    return this.RoleModel.findMany();
  }

  async getRoleById(roleId: string) {
    const role = await this.RoleModel.findUnique({
      where: { id: roleId },
    });

    if (!role) throw new ForbiddenException('Role could not be found');
    return role;
  }

  async createRole(dto: CreateRoleDto) {
    const role = await this.RoleModel.create({
      data: { ...dto },
    });

    return role;
  }

  async editRole(roleId: string, dto: UpdateRoleDto) {
    const role = await this.RoleModel.findUnique({
      where: { id: roleId },
    });

    if (!role) throw new ForbiddenException('Role could not be found');

    return this.RoleModel.update({
      data: { ...dto },
      where: { id: roleId },
    });
  }

  async deleteRole(roleId: string) {
    const role = await this.RoleModel.findUnique({
      where: { id: roleId },
    });
    if (!role) throw new ForbiddenException('Role could not be found');

    return this.RoleModel.delete({
      where: { id: roleId },
    });
  }

  async createAccess(roleId: string, agentId: string) {
    const role = await this.RoleModel.findUnique({
      where: { id: roleId },
      include: { agents: true },
    });

    if (!role) throw new ForbiddenException('Ressource(s) could not be found');

    const access = await this.AgentModel.update({
      where: { id: agentId },
      include: { roles: true },
      data: {
        roles: {
          connect: { id: roleId },
        },
      },
    });
    return access;
  }

  async removeAccess(roleId: string, agentId: string) {
    const role = await this.RoleModel.findUnique({
      where: { id: roleId },
      include: { agents: true },
    });

    if (!role) throw new ForbiddenException('Ressource(s) could not be found');

    const access = await this.AgentModel.update({
      where: { id: agentId },
      include: { roles: true },
      data: {
        roles: {
          disconnect: { id: roleId },
        },
      },
    });
    return access;
  }
}
