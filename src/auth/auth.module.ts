import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { AgentsService } from '../agents/agents.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [AuthService, JwtStrategy, AgentsService],
  controllers: [AuthController],
})
export class AuthModule {}
