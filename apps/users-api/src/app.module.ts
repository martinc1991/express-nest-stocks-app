import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { HistoryModule } from './history/history.module';
import { StatsModule } from './stats/stats.module';
import { StocksModule } from './stocks/stocks.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [AuthModule, UsersModule, HttpModule, StocksModule, StatsModule, HistoryModule, EmailModule],
  controllers: [AppController],
})
export class AppModule {}
