import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StatsModule } from 'src/stats/stats.module';
import { HistoryController } from './history.controller';
import { HistoryService } from './history.service';

@Module({
  imports: [PrismaModule, StatsModule],
  providers: [HistoryService],
  exports: [HistoryService],
  controllers: [HistoryController],
})
export class HistoryModule {}
