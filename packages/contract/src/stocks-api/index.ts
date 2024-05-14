import { CompleteStock } from '../stocks';

export type StocksApiErrorResponse = {
  statusCode: number;
  message: string;
};

export type StocksApiSuccessResponse = CompleteStock;
