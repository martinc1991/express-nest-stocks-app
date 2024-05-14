import { CompleteStock } from '../stocks';

export type UserHistory = Omit<CompleteStock, 'volume' | 'time'>;
