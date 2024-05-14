import { Test, TestingModule } from '@nestjs/testing';
import { StatsController } from './stats.controller';
import { PrismaClient } from '@prisma/client';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaService } from 'src/prisma/prisma.service';
import { StatsService } from './stats.service';

describe('StatsController', () => {
  let controller: StatsController;
  let service: StatsService;
  let prismaMock: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatsController],
      providers: [StatsService, { provide: PrismaService, useValue: prismaMock }],
    }).compile();

    service = module.get<StatsService>(StatsService);
    controller = module.get<StatsController>(StatsController);
  });

  describe('findAll', () => {
    it('should call statsService findMostFetched method with expected params', async () => {
      jest.spyOn(service, 'findMostFetched').mockResolvedValueOnce([]);

      await controller.findAll();

      expect(service.findMostFetched).toHaveBeenCalled();
    });
  });
});
