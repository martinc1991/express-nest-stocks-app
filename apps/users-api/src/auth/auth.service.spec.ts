import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { CryptoService } from 'src/crypto/crypto.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';
import { tokensStub } from './stub/jwt-token.stub';
import { userStub } from './stub/user.stub';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: DeepMockProxy<UsersService>;
  let prismaMock: DeepMockProxy<PrismaClient>;
  let jwtService: JwtService;
  let cryptoService: CryptoService;

  beforeEach(async () => {
    usersService = mockDeep<UsersService>();
    prismaMock = mockDeep<PrismaClient>();
    jwtService = mockDeep<JwtService>();
    cryptoService = mockDeep<CryptoService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
        {
          provide: UsersService,
          useValue: usersService,
        },
        {
          provide: CryptoService,
          useValue: cryptoService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('register method', () => {
    it('should call usersService createUser method with expected parameters', async () => {
      const dto: AuthDto = { email: userStub.email, role: userStub.role };

      jest.spyOn(usersService, 'createUser').mockResolvedValueOnce(userStub);

      await service.register(dto);

      expect(usersService.createUser).toHaveBeenCalledWith(dto.email, dto.role);
    });
    it('should return RegisterEndpointResponse type', async () => {
      const dto: AuthDto = { email: userStub.email, role: userStub.role };
      jest.spyOn(usersService, 'createUser').mockResolvedValueOnce(userStub);

      const response = await service.register(dto);

      expect(response).toEqual({ email: userStub.email, password: userStub.password });
    });
  });
  describe('signin method', () => {
    it('should call usersService findOneByEmail method with expected parameters', async () => {
      const dto = { email: userStub.email, role: userStub.role, id: userStub.id };

      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValueOnce(userStub);

      await service.signin(dto);

      expect(usersService.findOneByEmail).toHaveBeenCalledWith(dto.email);
    });
    it('should return null if no user is found', async () => {
      const dto = { email: userStub.email, role: userStub.role, id: userStub.id };
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValueOnce(null);

      const response = await service.signin(dto);

      expect(response).toBeNull();
    });
    it('should call getToken method with expected parameters', async () => {
      const dto = { email: userStub.email, role: userStub.role, id: userStub.id };
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValueOnce(userStub);

      jest.spyOn(service, 'getTokens').mockResolvedValueOnce({
        access_token: tokensStub.access_token,
        refresh_token: tokensStub.refresh_token,
      });

      await service.signin(dto);

      expect(service.getTokens).toHaveBeenCalledWith(userStub.id, userStub.email, userStub.role);
    });
    it('should return UserWithTokens type', async () => {
      const dto = { email: userStub.email, role: userStub.role, id: userStub.id };
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValueOnce(userStub);
      jest.spyOn(service, 'getTokens').mockResolvedValueOnce({
        access_token: tokensStub.access_token,
        refresh_token: tokensStub.refresh_token,
      });

      const response = await service.signin(dto);

      expect(response?.id).toBe(userStub.id);
      expect(response?.email).toBe(userStub.email);
      expect(response?.role).toBe(userStub.role);
      expect(response?.password).toBeDefined();
      expect(response?.access_token).toBe(tokensStub.access_token);
      expect(response?.refresh_token).toBe(tokensStub.refresh_token);
      expect(response?.createdAt).toBeDefined();
      expect(response?.updatedAt).toBeDefined();
    });
  });
});
