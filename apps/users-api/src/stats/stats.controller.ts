import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UsersApiStatsSuccessResponse } from 'contract';
import { JwtAdminAuthGuard } from 'src/auth/common/guards/jwt-auth-admin.guard';
import { StatsService } from './stats.service';

@ApiTags('Stats')
@Controller('stats')
export class StatsController {
  constructor(private statsService: StatsService) {}

  @ApiOkResponse({ description: 'Stats found.' })
  @ApiUnauthorizedResponse({ description: 'Invalid access token' })
  @UseGuards(JwtAdminAuthGuard)
  @Get()
  async findAll(): Promise<UsersApiStatsSuccessResponse> {
    const stats = await this.statsService.findMostFetched();

    return stats.map((stat) => ({
      stock: stat.stock,
      times_requested: stat.timesRequested,
    }));
  }
}
