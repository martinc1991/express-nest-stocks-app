import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaService } from 'src/prisma/prisma.service';
import { StatsService } from './stats.service';
import { completeStockStub } from 'src/stocks/stub/complete-stock';

describe('StatsService', () => {
  let service: StatsService;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatsService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<StatsService>(StatsService);
  });

  describe('createOrUpdate', () => {
    it('should call prisma.stats.upsert method with expected params', async () => {
      await service.createOrUpdate(completeStockStub);
      expect(prismaMock.stats.upsert).toHaveBeenCalledWith({
        where: { stock: completeStockStub.symbol },
        create: {
          stock: completeStockStub.symbol,
          timesRequested: 1,
        },
        update: {
          timesRequested: { increment: 1 },
        },
      });
    });
  });

  describe('findMostFetched', () => {
    it('should call prisma.stats.findMany method with expected params', async () => {
      await service.findMostFetched();

      expect(prismaMock.stats.findMany).toHaveBeenCalledWith({
        orderBy: { timesRequested: 'desc' },
        take: 5,
      });
    });
  });
});
