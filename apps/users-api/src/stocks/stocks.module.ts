import { Module } from '@nestjs/common';
import { HistoryModule } from 'src/history/history.module';
import { StocksController } from './stocks.controller';
import { StocksService } from './stocks.service';

@Module({
  imports: [HistoryModule],
  controllers: [StocksController],
  providers: [StocksService],
})
export class StocksModule {}
