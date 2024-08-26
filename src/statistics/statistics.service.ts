import { BadRequestException, Injectable } from '@nestjs/common';
import { StatisticQueryDto } from './dto/statistic-query.dto';
import { StatisticResponseDto, StatisticResult } from './dto/statistic-response.dto';
import { StatisticType, DATE_RANGE_CONFIGS } from './types/statistics.constants';
import { Posting } from '../entities/posting.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class StatisticsService {
  // TODO : posting Service를 사용하여 데이터를 조회하도록 구현 변경
  constructor(private readonly dataSource: DataSource) {}
  /**
   * 통계 조회 함수
   *
   * @param query 통계 조회 쿼리
   * @param userName api 호출한 사용자 이름
   */
  async getStatistics(query: StatisticQueryDto, userName: string): Promise<StatisticResponseDto> {
    const { hashtag, type, start, end } = query;

    if (hashtag === undefined || hashtag === '' || hashtag === null) {
      query.hashtag = userName; // hashtag 미입력 시 userName으로 대체
    }

    if (this.validateDate(start, end, type) === false) {
      throw new BadRequestException(`Invalid date range for type ${type}.`);
    }

    // get data from database
    const data = await this.getStatisticsData(query);
    return this.formatStatisticsData(data, query);
  }

  /**
   * type이 'date' 일 경우, 시작 시간과 종료 시간을 00:00:00, 23:59:59로 변경
   * @param start
   * @param end
   */
  private adjustDate(start: Date, end: Date): void {
    //NOTE: local time (KST) 기준으로 실행되고 있으므로 논의가 필요.
    // 대체안으로 setUTCHours()가 있음
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

  /**
   * 쿼리 조건에 따른 통계 데이터를 실제 database에서 조회
   *
   * @param query
   * @returns
   */
  private getStatisticsData(query: StatisticQueryDto): Promise<StatisticResult[]> {
    const { type, value, start, end, hashtag } = query;

    // type이 'date'일 경우, 날짜 포맷을 %Y-%m-%d로, 'hour'일 경우 %Y-%m-%d %H로 format 설정
    const dateFormat = type === StatisticType.DATE ? '"%Y-%m-%d"' : '"%Y-%m-%d %H"';

    return this.dataSource
      .getRepository(Posting)
      .createQueryBuilder('posting')
      .select(value === 'count' ? 'COUNT(posting.id)' : `SUM(posting.${value})`, 'value')
      .addSelect(`DATE_FORMAT(posting.createdAt, ${dateFormat})`, 'date')
      .innerJoin('posting.postingHashtags', 'postingHashtag')
      .innerJoin('postingHashtag.hashtag', 'hashtag')
      .where('hashtag.name = :hashtag', { hashtag })
      .andWhere('posting.createdAt >= :start', { start })
      .andWhere('posting.createdAt <= :end', { end })
      .groupBy('date')
      .orderBy('date', 'ASC')
      .getRawMany();
  }

  /**
   * 통계 데이터를 response dto로 변환
   *
   * @param data
   * @param query
   * @returns
   */
  private formatStatisticsData(data: StatisticResult[], query: StatisticQueryDto): StatisticResponseDto {
    return {
      hashtag: query.hashtag,
      type: query.type,
      start: query.start,
      end: query.end,
      value: query.value,
      statistics: data,
      total: data.length,
    };
  }
}
