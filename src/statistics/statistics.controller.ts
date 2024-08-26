import { Controller, Get, Query } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticQueryDto } from './dto/statistic-query.dto';
import { StatisticResponseDto } from './dto/statistic-response.dto';
import { ApiAcceptedResponse } from '@nestjs/swagger';

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
  getStatistic(@Query() statisticQuery: StatisticQueryDto): Promise<StatisticResponseDto> {
    // FIXME: 로그인 구현 후 userName을 가져오는 로직으로 변경
    const userName = 'testUser';
    return this.statisticService.getStatistics(statisticQuery, userName);
  }
}
