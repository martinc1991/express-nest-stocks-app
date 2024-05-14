import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { EmailService } from 'src/email/email.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtCompleteTokenStub } from './stub/jwt-token.stub';
import { userWithTokensStub } from './stub/user-with-token.stub';
import { userStub } from './stub/user.stub';

describe('AuthController', () => {
  let controller: AuthController;
  let prismaMock: DeepMockProxy<PrismaClient>;
  let serviceMock: DeepMockProxy<AuthService>;
  let emailService: DeepMockProxy<EmailService>;
  let usersService: DeepMockProxy<UsersService>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>();
    serviceMock = mockDeep<AuthService>();
    emailService = mockDeep<EmailService>();
    usersService = mockDeep<UsersService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: serviceMock },
        { provide: PrismaService, useValue: prismaMock },
        { provide: EmailService, useValue: emailService },
        { provide: UsersService, useValue: usersService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  describe('signup method', () => {
    it('should call authService register method with expected parameters', async () => {
      jest.spyOn(serviceMock, 'register');

      await controller.signup({ email: userStub.email, role: userStub.role });

      expect(serviceMock.register).toHaveBeenCalledWith({ email: userStub.email, role: userStub.role });
    });
  });

  describe('signin method', () => {
    it('should call authService signin method with expected parameters', async () => {
      jest.spyOn(serviceMock, 'signin').mockResolvedValueOnce(userWithTokensStub);

      await controller.signin(jwtCompleteTokenStub);

      expect(serviceMock.signin).toHaveBeenCalledWith({
        email: jwtCompleteTokenStub.email,
        role: jwtCompleteTokenStub.role,
        id: jwtCompleteTokenStub.id,
      });
    });

    it('should throw a not found exception if user does not exist', async () => {
      jest.spyOn(serviceMock, 'signin').mockResolvedValueOnce(null);

      await expect(controller.signin(jwtCompleteTokenStub)).rejects.toThrow(UnauthorizedException);
    });

    it('should return expected params', async () => {
      jest.spyOn(serviceMock, 'signin').mockResolvedValueOnce(userWithTokensStub);

      const expectedResponse = {
        id: userWithTokensStub.id,
        email: userWithTokensStub.email,
        role: userWithTokensStub.role,
        access_token: userWithTokensStub.access_token,
        refresh_token: userWithTokensStub.refresh_token,
      };

      const response = await controller.signin(jwtCompleteTokenStub);

      expect(response).toEqual(expectedResponse);
    });
  });
});
