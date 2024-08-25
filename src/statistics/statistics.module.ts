import { Module } from '@nestjs/common';
import { StatisticController } from './statistics.controller';
import { StatisticService } from './statistics.service';

@Module({
  controllers: [StatisticController],
  providers: [StatisticService],
})
export class StatisticModule {}
