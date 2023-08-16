import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private config: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  sendMail(mail: string, html: any): void {
    this.mailerService.sendMail({
      to: mail,
      from: this.config.get('MAIL_USER'),
      subject: 'Register success',
      text: 'Congrats',
      html: html,
    });
  }
}