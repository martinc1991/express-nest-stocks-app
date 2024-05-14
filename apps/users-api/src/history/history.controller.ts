import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UserHistoryResponse } from 'contract';
import { JwtStrategyUser } from 'src/auth/common/decorators';
import { JwtAuthGuard } from 'src/auth/common/guards';
import { HistoryService } from './history.service';

@ApiTags('History')
@Controller('history')
export class HistoryController {
  constructor(private historyService: HistoryService) {}

  @ApiOkResponse({ description: 'History found.' })
  @ApiUnauthorizedResponse({ description: 'Invalid access token' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@JwtStrategyUser() user: JwtStrategyUser): Promise<UserHistoryResponse> {
    const history = await this.historyService.findAllByUser(user.id);

    return history.map((record) => ({
      date: record.createdAt.toISOString(),
      name: record.name,
      symbol: record.symbol,
      open: record.open,
      high: record.high,
      low: record.low,
      close: record.close,
    }));
  }
}
