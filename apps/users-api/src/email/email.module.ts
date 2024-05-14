import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.MAILTRAP_HOST,
          port: Number(process.env.MAILTRAP_PORT) || 2525,
          auth: {
            user: process.env.MAILTRAP_USERNAME,
            pass: process.env.MAILTRAP_PASSWORD,
          },
        },
      }),
    }),
  ],
  exports: [EmailService],
  providers: [EmailService],
})
export class EmailModule {}
