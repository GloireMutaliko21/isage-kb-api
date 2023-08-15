import { PrismaService } from './../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: { sub: string; email: string }) {
    const user = await this.prisma.agent.findUnique({
      where: { id: payload.sub },
      include: { roles: true, grade: true, folderElements: true },
    });
    delete user.password;
    const roles = user.roles.map((role) => role.title);
    delete user.roles;
    return { ...user, roles };
  }
}
