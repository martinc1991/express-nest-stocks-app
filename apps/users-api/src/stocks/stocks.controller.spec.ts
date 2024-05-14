import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { jwtCompleteTokenStub } from 'src/auth/stub/jwt-token.stub';
import { HistoryService } from 'src/history/history.service';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';
import { completeStockStub } from './stub/complete-stock';

describe('StocksController', () => {
  let controller: StocksController;
  let service: StocksService;
  let historyService: DeepMockProxy<HistoryService>;

  beforeEach(async () => {
    historyService = mockDeep<HistoryService>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [StocksController],
      providers: [
        StocksService,
        {
          provide: HistoryService,
          useValue: historyService,
        },
      ],
    }).compile();

    controller = module.get<StocksController>(StocksController);
    service = module.get<StocksService>(StocksService);
  });

  describe('findAll method', () => {
    const query = 'AAPL';

    it('should call stockQueryService findOne method with expected parameters', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(completeStockStub);

      await controller.findAll(query, jwtCompleteTokenStub);

      expect(service.findOne).toHaveBeenCalledWith(query);
    });

    it('should call historyService createRecord method with expected parameters', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(completeStockStub);

      await controller.findAll(query, jwtCompleteTokenStub);

      expect(historyService.createRecord).toHaveBeenCalledWith({ userId: jwtCompleteTokenStub.id, stock: completeStockStub });
    });
  });
});
