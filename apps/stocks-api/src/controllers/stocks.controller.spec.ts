import { createRequest, createResponse } from 'node-mocks-http';
import * as service from '../services/stocks.services';
import * as getStock from '../utils/get-stooq-api-url';
import * as parseCsv from '../utils/parse-csv';
import { getStockController } from './stocks.controller';

describe('getStockController', () => {
  it('should return stock information for a valid stock code', async () => {
    const req = createRequest({
      method: 'GET',
      url: '/stocks',
      query: { q: 'AAPL' },
    });
    const res = createResponse();

    const mockedResJson = jest.spyOn(res, 'json');
    const mockedFetchStock = jest.spyOn(service, 'fetchStock');
    const mockedParseStockResponse = jest.spyOn(parseCsv, 'parseStockResponse');
    const mockedGetStooqApiURL = jest.spyOn(getStock, 'getStooqApiURL');

    await getStockController(req, res);

    expect(mockedFetchStock).toHaveBeenCalledWith('AAPL');
    expect(mockedParseStockResponse).toHaveBeenCalled();
    expect(mockedGetStooqApiURL).toHaveBeenCalled();
    expect(mockedResJson).toHaveBeenCalled();
  });
  it('should return an error message for invalid stock code', async () => {
    const req = createRequest({
      method: 'GET',
      url: '/stocks',
      query: { q: 'SO-MUCH-INVALID' },
    });
    const res = createResponse();

    const mockedResStatus = jest.spyOn(res, 'status');
    const mockedResJson = jest.spyOn(res, 'json');

    await getStockController(req, res);

    expect(mockedResStatus).toHaveBeenCalledWith(404);
    expect(mockedResJson).toHaveBeenCalledWith({ message: 'Stock not found', statusCode: 404 });
  });
});
