import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UsersApiStockSuccessResponse } from 'contract';
import { JwtStrategyUser } from 'src/auth/common/decorators';
import { JwtAuthGuard } from 'src/auth/common/guards';
import { HistoryService } from 'src/history/history.service';
import { StocksService } from './stocks.service';

@ApiTags('Stocks')
@Controller('stock')
export class StocksController {
  constructor(
    private readonly stockQueryService: StocksService,
    private history: HistoryService,
  ) {}

  @ApiOkResponse({ description: 'Stock found.' })
  @ApiUnauthorizedResponse({ description: 'Invalid access token' })
  @ApiNotFoundResponse({ description: 'Stock not found' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query('q') query: string, @JwtStrategyUser() user: JwtStrategyUser): Promise<UsersApiStockSuccessResponse> {
    const stock = await this.stockQueryService.findOne(query);

    await this.history.createRecord({ userId: user.id, stock });

    return {
      name: stock.name,
      symbol: stock.symbol,
      open: stock.open,
      high: stock.high,
      low: stock.low,
      close: stock.close,
    };
  }
}
