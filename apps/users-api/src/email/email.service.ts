import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendResetEmail(email: string, newPassword: string) {
    const message = `Forgot your password? Here's the new one: ${newPassword}`;

    this.mailerService.sendMail({
      from: `Martin <${process.env.MAILTRAP_FROM}>`,
      to: email,
      subject: `Password reset`,
      text: message,
    });
  }
}
