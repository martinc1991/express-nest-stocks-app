import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { StatsService } from 'src/stats/stats.service';
import { HistoryService } from './history.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { CreateHistoryDto } from './dto/create-history.dto';

const createHistoryStub: CreateHistoryDto = {
  userId: '1',
  stock: {
    name: 'test',
    symbol: 'test',
    open: 1,
    high: 1,
    low: 1,
    close: 1,
    date: 'test',
    time: 'test',
    volume: 1,
  },
};

describe('HistoryService', () => {
  let service: HistoryService;
  let prismaMock: DeepMockProxy<PrismaClient>;
  let statsService: DeepMockProxy<StatsService>;
  let httpService: DeepMockProxy<HttpService>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>();
    statsService = mockDeep<StatsService>();
    httpService = mockDeep<HttpService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HistoryService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
        {
          provide: StatsService,
          useValue: statsService,
        },
        {
          provide: HttpService,
          useValue: httpService,
        },
      ],
    }).compile();

    service = module.get<HistoryService>(HistoryService);
  });

  describe('createRecord method', () => {
    it('should use a prisma $transaction', async () => {
      await service.createRecord(createHistoryStub);

      expect(prismaMock.$transaction).toHaveBeenCalled();
    });
  });
  describe('findAllByUser method', () => {
    it('should call prisma.history.findMany method with expected params', async () => {
      await service.findAllByUser(createHistoryStub.userId);

      expect(prismaMock.history.findMany).toHaveBeenCalledWith({
        where: { user: { id: createHistoryStub.userId } },
        orderBy: { createdAt: 'desc' },
      });
    });
  });
});
