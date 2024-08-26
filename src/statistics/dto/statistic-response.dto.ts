import { StatisticType, StatisticValue } from '../types/statistics.constants';

export type StatisticResult = {
  date: Date;
  value: number;
};

export class StatisticResponseDto {
  /**
   * 통계 조회 해시태그
   */
  hashtag: string;

  /**
   * 조회 타입
   */
  type: StatisticType;

  /**
   * 조회 시작 시간
   */

  start: Date;

  /**
   * 조회 종료 시간
   */
  end: Date;

  /**
   * 조회 값
   */
  value: StatisticValue;

  /**
   * 통계 결과
   */
  statistics: StatisticResult[];

  /**
   * 통계 결과 갯수
   */
  total: number;
}
