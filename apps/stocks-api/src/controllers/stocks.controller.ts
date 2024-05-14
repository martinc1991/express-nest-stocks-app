import { StocksApiErrorResponse, StocksApiSuccessResponse } from 'contract';
import { Request, Response } from 'express';
import { fetchStock } from '../services';
import { parseStockResponse, validateStooqApiResponse } from '../utils';

export async function getStockController(req: Request, res: Response<StocksApiSuccessResponse | StocksApiErrorResponse>): Promise<void> {
  try {
    const stockCode = req.query.q;

    if (!stockCode || typeof stockCode !== 'string') throw new Error('Invalid stock code');

    const stockInfo = await fetchStock(stockCode);

    const parsedResponse = parseStockResponse(stockInfo);

    const validatedResponse = validateStooqApiResponse(parsedResponse);

    if (!validatedResponse) throw new Error('Stock not found');

    res.json(validatedResponse);
  } catch (error) {
    res.status(404).json({ message: error.message, statusCode: 404 });
  }
}
