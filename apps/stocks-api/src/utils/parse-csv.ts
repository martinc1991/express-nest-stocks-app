import type { CompleteStock, CompleteStringStock } from 'contract';

/**
 * Parses the stock response CSV data to JSON.
 */
export function parseStockResponse(csvData: string): CompleteStringStock {
  const rows = csvData.trim().split('\n');

  const headersRow = rows[0];
  const dataRow = rows[1];

  const dataArr = dataRow.split(',');

  if (headersRow.split(',').length !== dataRow.split(',').length) throw new Error('Invalid CSV data');

  const stockInfo = {
    symbol: dataArr[0],
    date: dataArr[1],
    time: dataArr[2],
    open: dataArr[3],
    high: dataArr[4],
    low: dataArr[5],
    close: dataArr[6],
    volume: dataArr[7],
    name: dataArr[8],
  };

  return stockInfo;
}

// Stock data example
// Symbol,Date,Time,Open,High,Low,Close,Volume,Name
// A.US,2024-05-07,22:00:15,141.12,142.15,139.76,141.27,1486839,AGILENT TECHNOLOGIES

// Not found stock data example
// Symbol,Date,Time,Open,High,Low,Close,Volume,Name
// A.USDSADAWDSADWA,N/D,N/D,N/D,N/D,N/D,N/D,N/D,A.USDSADAWDSADWA

/**
 * Validates the response from the Stooq API and returns a formatted object if the stock was found,
 * otherwise returns null.
 */
export function validateStooqApiResponse(stockInfo: CompleteStringStock): CompleteStock | null {
  const symbol = stockInfo.symbol;
  const date = stockInfo.date;
  const time = stockInfo.time;
  const open = parseFloat(stockInfo.open);
  const high = parseFloat(stockInfo.high);
  const low = parseFloat(stockInfo.low);
  const close = parseFloat(stockInfo.close);
  const volume = parseInt(stockInfo.volume);
  const name = stockInfo.name;

  // This is enough to check if the stock was found
  if ([open, high, low, close, volume].some((value) => isNaN(value))) return null;

  return { symbol, date, time, open, high, low, close, volume, name };
}
