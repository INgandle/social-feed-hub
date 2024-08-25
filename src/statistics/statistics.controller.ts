import { Controller, Get, Query } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticQueryDto } from './dto/statistic-query.dto';
import { StatisticResponseDto } from './dto/statistic-response.dto';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticService: StatisticsService) {}

  @Get()
  getStatistic(@Query() statisticQuery: StatisticQueryDto): Promise<StatisticResponseDto> {
    // FIXME: 로그인 구현 후 userName을 가져오는 로직으로 변경
    const userName = 'testUser';
    return this.statisticService.getStatistics(statisticQuery, userName);
  }
}
