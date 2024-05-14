import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { MailerService } from '@nestjs-modules/mailer';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

describe('EmailService', () => {
  let service: EmailService;
  let mailerService: DeepMockProxy<MailerService>;

  beforeEach(async () => {
    mailerService = mockDeep<MailerService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: MailerService,
          useValue: mailerService,
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  describe('sendEmail', () => {
    it('should call sendMail method with expected parameters', async () => {
      const sendMailMock = jest.spyOn(mailerService, 'sendMail').mockResolvedValue(null);
      const email = 'test@mail';
      const newPassword = 'test message';
      const message = `Forgot your password? Here's the new one: ${newPassword}`;

      await service.sendResetEmail(email, newPassword);

      expect(sendMailMock).toHaveBeenCalledWith({
        from: `Martin <${process.env.MAILTRAP_FROM}>`,
        to: email,
        subject: 'Password reset',
        text: message,
      });
    });
  });
});
