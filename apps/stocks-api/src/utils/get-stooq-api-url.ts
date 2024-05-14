export function getStooqApiURL(stockCode: string): string {
  const encodedStockCode = encodeURIComponent(stockCode);

  return process.env.STOOQ_API_ENDPOINT.replace(process.env.STOCK_CODE_REPLACE, encodedStockCode);
}
