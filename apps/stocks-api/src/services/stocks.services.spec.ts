import axios from 'axios';
import { fetchStock } from './stocks.services';
import * as utils from '../utils/get-stooq-api-url';

jest.mock('axios');

describe('stocks services', () => {
  describe('fetchStock', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('fetches stock data successfully', async () => {
      const mockResponseData = 'Mock stock data';
      const mockStockCode = 'AAPL';
      const mockUrl = 'https://stooq.com/q/l/?s=AAPL&f=sd2t2ohlcvn&h=&e=csv';

      const mockedAxiosGet = jest.spyOn(axios, 'get').mockResolvedValueOnce({
        data: mockResponseData,
      });

      const mockedGetStooqApiURL = jest.spyOn(utils, 'getStooqApiURL').mockReturnValueOnce(mockUrl);

      const stockData = await fetchStock(mockStockCode);

      expect(mockedGetStooqApiURL).toHaveBeenCalledWith(mockStockCode);
      expect(mockedAxiosGet).toHaveBeenCalledWith(mockUrl);
      expect(stockData).toEqual(mockResponseData);
    });

    it('handles errors', async () => {
      const mockStockCode = 'AAPL';
      const mockUrl = 'https://stooq.com/q/l/?s=AAPL&f=sd2t2ohlcvn&h=&e=csv';
      const errorMessage = 'Failed to fetch stock data';

      const mockedAxiosGet = jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error(errorMessage));

      await expect(fetchStock(mockStockCode)).rejects.toThrow(errorMessage);
      expect(mockedAxiosGet).toHaveBeenCalledWith(mockUrl);
    });
  });
});
