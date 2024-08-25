import { Module } from '@nestjs/common';
import { StatisticsController as StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Posting } from '../entities/posting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Posting])],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
