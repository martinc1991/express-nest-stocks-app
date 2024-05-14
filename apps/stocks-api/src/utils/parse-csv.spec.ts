import { parseStockResponse, validateStooqApiResponse } from './parse-csv';

const firstRow = 'Symbol,Date,Time,Open,High,Low,Close,Volume,Name';

describe('parseStockResponse function', () => {
  it('should correctly parse valid CSV data', () => {
    const csvData = firstRow + '\n' + `AAPL.US,2024-05-07,16:00:00,139.16,141.36,138.70,140.36,81866375,Apple Inc.`;
    const expectedOutput = {
      symbol: 'AAPL.US',
      date: '2024-05-07',
      time: '16:00:00',
      open: '139.16',
      high: '141.36',
      low: '138.70',
      close: '140.36',
      volume: '81866375',
      name: 'Apple Inc.',
    };
    expect(parseStockResponse(csvData)).toEqual(expectedOutput);
  });

  it('should handle invalid CSV data gracefully', () => {
    const invalidCsvData = firstRow + '\n' + 'AAPL.US,2024-05-07';
    expect(() => parseStockResponse(invalidCsvData)).toThrow();
  });

  it('should handle empty CSV data gracefully', () => {
    const emptyCsvData = firstRow + '\n' + '';
    expect(() => parseStockResponse(emptyCsvData)).toThrow();
  });
});

describe('validateStooqApiResponse function', () => {
  it('should return formatted JSON for a valid Stooq API response', () => {
    const validApiResponse = {
      symbol: 'AAPL.US',
      date: '2024-05-07',
      time: '16:00:00',
      open: '139.16',
      high: '141.6',
      low: '138.70',
      close: '140.36',
      volume: '81866375',
      name: 'Apple Inc.',
    };
    const expectedOutput = {
      symbol: 'AAPL.US',
      date: '2024-05-07',
      time: '16:00:00',
      open: 139.16,
      high: 141.6,
      low: 138.7,
      close: 140.36,
      volume: 81866375,
      name: 'Apple Inc.',
    };
    expect(validateStooqApiResponse(validApiResponse)).toEqual(expectedOutput);
  });

  it('should return null for a Stooq API response with invalid field types', () => {
    const invalidTypeApiResponse = {
      symbol: 'AAPL.US',
      date: '2024-05-07',
      time: '16:00:00',
      open: 'invalid', // Invalid type (string instead of number)
      high: '141.36',
      low: '138.70',
      close: '140.36',
      volume: '81866375',
      name: 'Apple Inc.',
    };
    expect(validateStooqApiResponse(invalidTypeApiResponse)).toBeNull();
  });
});
