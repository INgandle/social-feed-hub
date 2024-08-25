export const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
export const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

export enum StatisticType {
  DATE = 'date',
  HOUR = 'hour',
}

export enum StatisticValue {
  COUNT = 'count',
  VIEW_COUNT = 'view_count',
  LIKE_COUNT = 'like_count',
  SHARE_COUNT = 'share_count',
}

type DateRangeConfig = {
  maxRange: number;
};

export const DATE_RANGE_CONFIGS: Record<StatisticType, DateRangeConfig> = {
  [StatisticType.HOUR]: { maxRange: SEVEN_DAYS },
  [StatisticType.DATE]: { maxRange: THIRTY_DAYS },
};
