import { IsString } from 'class-validator';
import { CompleteStock } from 'contract';

export class CreateHistoryDto {
  @IsString()
  userId: string;

  stock: CompleteStock;
}
