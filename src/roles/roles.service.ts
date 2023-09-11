import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto, UpdateRoleDto } from './dto';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  private RoleModel = this.prisma.role;
  private AgentModel = this.prisma.agent;

  async getRoles() {
    try {
      return await this.RoleModel.findMany();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getRoleById(roleId: string) {
    try {
      const role = await this.RoleModel.findUnique({
        where: { id: roleId },
      });

      if (!role) throw new ForbiddenException('Role could not be found');
      return role;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createRole(dto: CreateRoleDto) {
    try {
      const role = await this.RoleModel.create({
        data: { ...dto },
      });

      return role;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async editRole(roleId: string, dto: UpdateRoleDto) {
    try {
      const role = await this.RoleModel.findUnique({
        where: { id: roleId },
      });

      if (!role) throw new ForbiddenException('Role could not be found');

      return this.RoleModel.update({
        data: { ...dto },
        where: { id: roleId },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteRole(roleId: string) {
    try {
      const role = await this.RoleModel.findUnique({
        where: { id: roleId },
      });
      if (!role) throw new ForbiddenException('Role could not be found');

      return this.RoleModel.delete({
        where: { id: roleId },
        select: {
          id: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createAccess(roleId: string, agentId: string) {
    try {
      const role = await this.RoleModel.findUnique({
        where: { id: roleId },
        include: { agents: true },
      });

      if (!role)
        throw new ForbiddenException('Ressource(s) could not be found');

      return this.AgentModel.update({
        where: { id: agentId },
        include: { roles: true },
        data: {
          roles: {
            connect: { id: roleId },
          },
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async removeAccess(roleId: string, agentId: string) {
    try {
      const role = await this.RoleModel.findUnique({
        where: { id: roleId },
        include: { agents: true },
      });

      if (!role)
        throw new ForbiddenException('Ressource(s) could not be found');

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
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
