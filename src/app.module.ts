import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { ScheduleModule } from '@nestjs/schedule';

import { MailModule } from './mail/mail.module';
import { GradesModule } from './grades/grades.module';
import { AgentsModule } from './agents/agents.module';
import { RolesModule } from './roles/roles.module';
import { PrismaModule } from './prisma/prisma.module';
import { FolderElementModule } from './folder-element/folder-element.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AuthModule } from './auth/auth.module';
import { CongeModule } from './conge/conge.module';
import { AttendencyModule } from './attendency/attendency.module';
import { AgentFilesModule } from './agent-files/agent-files.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    FolderElementModule,
    GradesModule,
    RolesModule,
    AgentsModule,
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      },
    }),
    MailModule,
    PrismaModule,
    CloudinaryModule,
    AuthModule,
    CongeModule,
    AttendencyModule,
    AgentFilesModule,
  ],
})
export class AppModule {}
