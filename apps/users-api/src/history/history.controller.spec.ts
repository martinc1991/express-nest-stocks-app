import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { jwtCompleteTokenStub } from 'src/auth/stub/jwt-token.stub';
import { HistoryService } from 'src/history/history.service';
import { HistoryController } from './history.controller';
import { completeStockStub } from 'src/stocks/stub/complete-stock';

const completeHistoryStub = {
  ...completeStockStub,
  id: 'test',
  userId: 'test',
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('HistoryControllar', () => {
  let controller: HistoryController;
  let historyService: DeepMockProxy<HistoryService>;

  beforeEach(async () => {
    historyService = mockDeep<HistoryService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HistoryController],
      providers: [
        {
          provide: HistoryService,
          useValue: historyService,
        },
      ],
    }).compile();

    controller = module.get<HistoryController>(HistoryController);
  });

  describe('findAll method', () => {
    it('should call historyService findAllByUser method with expected parameters', async () => {
      jest.spyOn(historyService, 'findAllByUser').mockResolvedValueOnce([completeHistoryStub]);

      const response = await controller.findAll(jwtCompleteTokenStub);

      expect(historyService.findAllByUser).toHaveBeenCalledWith(jwtCompleteTokenStub.id);
      expect(response).toHaveLength(1);
      expect(response[0].date).toBeDefined();
      expect(response[0].name).toBeDefined();
      expect(response[0].symbol).toBeDefined();
      expect(response[0].open).toBeDefined();
      expect(response[0].high).toBeDefined();
      expect(response[0].low).toBeDefined();
      expect(response[0].close).toBeDefined();
    });
  });
});
