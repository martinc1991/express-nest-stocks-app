import { getStooqApiURL } from './get-stooq-api-url';

describe('getStooqApiUrl', () => {
  it('should return a URL with the correct host and query params', () => {
    const stockCode = 'AAPL';
    const url = getStooqApiURL(stockCode);
    expect(url).toBe(`https://stooq.com/q/l/?s=${stockCode}&f=sd2t2ohlcvn&h=&e=csv`);
  });
  it('should return a URL with the s param empty if stockCode is not provided but with equal sign present', () => {
    const stockCode = '';
    const url = getStooqApiURL(stockCode);
    expect(url).toBe(`https://stooq.com/q/l/?s=${stockCode}&f=sd2t2ohlcvn&h=&e=csv`);
    expect(url).toContain(`?s=`);
  });

  it('should correctly encode invalid characters in stock code', () => {
    const testCases = [
      { stockCode: 'GOO&^', expectedURL: 'https://stooq.com/q/l/?s=GOO%26%5E&f=sd2t2ohlcvn&h=&e=csv' },
      { stockCode: 'MSFT%', expectedURL: 'https://stooq.com/q/l/?s=MSFT%25&f=sd2t2ohlcvn&h=&e=csv' },
      { stockCode: 'AMZN$', expectedURL: 'https://stooq.com/q/l/?s=AMZN%24&f=sd2t2ohlcvn&h=&e=csv' },
    ];

    testCases.forEach(({ stockCode, expectedURL }) => {
      const actualURL = getStooqApiURL(stockCode);

      expect(actualURL).toBe(expectedURL);
    });
  });
});
