/**
 * GET /statistic 에서 쿼리 파라미터로 받을 DTO
 */
import { Type } from 'class-transformer';
import { IsEnum, IsDate, IsString, IsOptional, Length } from 'class-validator';

import { StatisticType, StatisticValue, SEVEN_DAYS } from '../types/statistics.constants';

export class StatisticQueryDto {
  /**
   * 통계를 조회할 해시태그
   * @example 'wanted'
   */
  @IsOptional()
  @IsString()
  @Length(1, 255)
  hashtag: string;

  /**
   * 통계 타입 (일별, 시간별)
   * @example 'date'
   */
  @IsEnum(StatisticType)
  type: StatisticType = StatisticType.DATE;

  /**
   * 통계 조회 시작일
   * @example '2024-01-01'
   */
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  start: Date = new Date(new Date().getTime() - SEVEN_DAYS); // request 시점으로부터 7일 전

  /**
   * 통계 조회 종료일
   * @example '2024-01-31'
   */
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  end: Date = new Date();

  /**
   * 조회할 통계 값 (게시물 수, 조회수, 좋아요 수, 공유 수)
   * @example 'count'
   */
  @IsOptional()
  @IsEnum(StatisticValue)
  value: StatisticValue = StatisticValue.COUNT;
}
