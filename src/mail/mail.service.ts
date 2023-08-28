import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private config: ConfigService,
    private readonly mailerService: MailerService,
  ) {}
  // send mail
  sendMail(mailObject: string, mail: string, html: any): void {
    this.mailerService.sendMail({
      to: mail,
      from: this.config.get('MAIL_USER'),
      subject: mailObject,
      text: 'Congrats',
      html: html,
    });
  }
}
