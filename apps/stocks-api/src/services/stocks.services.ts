import axios from 'axios';
import { getStooqApiURL } from '../utils';

export async function fetchStock(stockCode: string): Promise<string> {
  try {
    const url = getStooqApiURL(stockCode);

    const response = await axios.get<string>(url);

    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch stock data');
  }
}
