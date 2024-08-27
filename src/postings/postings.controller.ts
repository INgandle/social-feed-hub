import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { PostingsService } from './postings.service';
import { PostingResponseDto } from './dto/posting-response.dto';
import { PostingQueryDto } from './dto/posting-query.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/entities/user.entity';

@Controller('postings')
export class PostingsController {
  constructor(private readonly postingsService: PostingsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Req() req: Request, @Query() queries: PostingQueryDto): Promise<PostingResponseDto[]> {
    const hashtag = queries.hashtag || (req.user as User).accountName;
    return await this.postingsService.findAll(hashtag, queries);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PostingResponseDto> {
    return await this.postingsService.findOne(id);
  }
}
