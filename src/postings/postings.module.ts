import { Module } from '@nestjs/common';
import { PostingsService } from './postings.service';
import { PostingsController } from './postings.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { Posting } from 'src/entities/posting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Posting])],
  controllers: [PostingsController],
  providers: [PostingsService],
})
export class PostingsModule {}
