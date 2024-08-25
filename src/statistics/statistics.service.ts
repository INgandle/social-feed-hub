import { BadRequestException, Injectable } from '@nestjs/common';
import { StatisticQueryDto } from './dto/statistic-query.dto';
import { StatisticResponseDto } from './dto/statistic-response.dto';
import { StatisticType, DATE_RANGE_CONFIGS } from './types/statistics.types';

@Injectable()
export class StatisticService {
  /**
   * 통계 조회 함수
   *
   * @param statisticQueryDto
   * @param userName
   */
  getStatistic(statisticQueryDto: StatisticQueryDto, userName: string) {
    let { hashtag, type, start, end, value } = statisticQueryDto;

    if (hashtag === undefined || hashtag === '' || hashtag === null) {
      // hashtag 미입력 시 userName으로 대체
      hashtag = userName;
    }

    if (this.validateDate(start, end, type) === false) {
      throw new BadRequestException(`Invalid date range for type ${type}.`);
    }

    // get data from database
  }

  /**
   * type이 'date' 일 경우, 시작 시간과 종료 시간을 00:00:00, 23:59:59로 변경
   * @param start
   * @param end
   */
  private adjustDate(start: Date, end: Date): void {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  }

  /**
   * 조회 타입에 따른 날짜 유효성 검증
   * type이 'hour'일 경우, start end 간격이 7일 이내
   * type이 'date'일 경우, 30일 이내
   *
   * @param start
   * @param end
   * @param type
   */
  private validateDate(start: Date, end: Date, type: StatisticType): boolean {
    const now = new Date();
    // type에 따른 date validation
    if (type === StatisticType.DATE) {
      this.adjustDate(start, end);
    }

    // 현 시간보다 이후의 시간이거나, start가 end보다 클 경우 false 반환
    if (start > end || end > now) {
      return false;
    }

    const range = end.getTime() - start.getTime();
    const maxRange = DATE_RANGE_CONFIGS[type].maxRange;

    return range <= maxRange;
  }
}
