import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { HistoryService } from 'src/history/history.service';
import { StocksService } from './stocks.service';
import { completeStockStub } from './stub/complete-stock';

describe('StocksService', () => {
  let service: StocksService;
  let historyService: DeepMockProxy<HistoryService>;

  beforeEach(async () => {
    historyService = mockDeep<HistoryService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StocksService,
        {
          provide: HistoryService,
          useValue: historyService,
        },
      ],
    }).compile();

    service = module.get<StocksService>(StocksService);
  });

  describe('findOne', () => {
    it('should call fetchStock method with expected parameters', async () => {
      const stockCode = 'AAPL';
      const fetchStockMock = jest.spyOn(service, 'fetchStock').mockResolvedValue(completeStockStub);

      await service.findOne(stockCode);

      expect(fetchStockMock).toHaveBeenCalledWith(stockCode);
    });
  });

  describe('fetchStock', () => {
    it('should call axios.get with expected parameters', async () => {
      const stockCode = 'AAPL';
      const expectedParams = `${process.env.STOCKS_API_URL}/stock?q=${stockCode}`;
      const axiosGetMock = jest.spyOn(axios, 'get').mockResolvedValue({ data: null });

      await service.fetchStock(stockCode);

      expect(axiosGetMock).toHaveBeenCalledWith(expectedParams);
    });
  });
});
