import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { CryptoService } from 'src/crypto/crypto.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { createUserStub } from './stub/create-user.stub';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let prismaMock: DeepMockProxy<PrismaClient>;
  let cryptoService: DeepMockProxy<CryptoService>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>();
    cryptoService = mockDeep<CryptoService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: CryptoService,
          useValue: cryptoService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('create method', () => {
    it('should hash user password', async () => {
      await service.createUser(createUserStub.email, createUserStub.role);

      expect(cryptoService.hash).toHaveBeenCalled();
    });
  });
});
