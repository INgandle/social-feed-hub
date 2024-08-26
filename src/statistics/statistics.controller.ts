import { Controller, Get, Query, Req } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticQueryDto } from './dto/statistic-query.dto';
import { StatisticResponseDto } from './dto/statistic-response.dto';
import { ApiAcceptedResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { User } from '../entities/user.entity';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticService: StatisticsService) {}

  /**
   * 통계 조회 API
   *
   * @param statisticQuery hashtag, type, start, end, value
   * @returns 계산된 통계 결과
   */
  @Get()
  @ApiAcceptedResponse({ type: StatisticResponseDto })
  getStatistic(@Query() statisticQuery: StatisticQueryDto, @Req() req: Request): Promise<StatisticResponseDto> {
    const userName = (req.user as User).accountName;
    return this.statisticService.getStatistics(statisticQuery, userName);
  }
}
