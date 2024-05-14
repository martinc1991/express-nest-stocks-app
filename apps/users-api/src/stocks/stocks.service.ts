import { Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { CompleteStock, StocksApiSuccessResponse } from 'contract';

@Injectable()
export class StocksService {
  constructor() {}
  findOne(stockCode: string): Promise<CompleteStock> {
    return this.fetchStock(stockCode);
  }

  async fetchStock(stockCode: string): Promise<CompleteStock> {
    try {
      const { data } = await axios.get<StocksApiSuccessResponse>(`${process.env.STOCKS_API_URL}/stock?q=${stockCode}`);

      return data;
    } catch (error) {
      throw new NotFoundException('Stock not found');
    }
  }
}
