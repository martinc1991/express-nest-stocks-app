import { Injectable } from '@nestjs/common';
import { CompleteStock } from 'contract';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}
  createOrUpdate(stock: CompleteStock) {
    return this.prisma.stats.upsert({
      where: { stock: stock.symbol },
      create: {
        stock: stock.symbol,
        timesRequested: 1,
      },
      update: {
        timesRequested: { increment: 1 },
      },
    });
  }

  findMostFetched() {
    return this.prisma.stats.findMany({
      orderBy: { timesRequested: 'desc' },
      take: 5,
    });
  }
}
