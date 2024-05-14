import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { StatsService } from 'src/stats/stats.service';
import { CreateHistoryDto } from './dto/create-history.dto';

@Injectable()
export class HistoryService {
  constructor(
    private prisma: PrismaService,
    private stats: StatsService,
  ) {}
  createRecord(createHistoryDto: CreateHistoryDto): Promise<void> {
    return this.prisma.$transaction(async (prisma) => {
      await prisma.history.create({
        data: {
          close: createHistoryDto.stock.close,
          high: createHistoryDto.stock.high,
          low: createHistoryDto.stock.low,
          open: createHistoryDto.stock.open,
          symbol: createHistoryDto.stock.symbol,
          name: createHistoryDto.stock.name,
          user: {
            connect: {
              id: createHistoryDto.userId,
            },
          },
        },
      });

      await this.stats.createOrUpdate(createHistoryDto.stock);
    });
  }

  findAllByUser(userId: string) {
    return this.prisma.history.findMany({
      where: { user: { id: userId } },
      orderBy: { createdAt: 'desc' },
    });
  }
}
