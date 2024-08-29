import { Controller, HttpCode, HttpStatus, Param, Patch, Get, Query, Req } from '@nestjs/common';
import { PostingsService } from './postings.service';
import { Request } from 'express';
import { PostingResponseDto } from './dto/posting-response.dto';
import { PostingQueryDto } from './dto/posting-query.dto';
import { User } from 'src/entities/user.entity';

@Controller('postings')
export class PostingsController {
  constructor(private readonly postingsService: PostingsService) {}

  @Get()
  async findAll(@Req() req: Request, @Query() queries: PostingQueryDto): Promise<PostingResponseDto[]> {
    const hashtag = queries.hashtag || (req.user as User).accountName;
    return await this.postingsService.findAll(hashtag, queries);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PostingResponseDto> {
    return await this.postingsService.findOne(id);
  }

  @Patch(':id/like')
  @HttpCode(HttpStatus.NO_CONTENT) //성공시 204 No Content
  async likePosting(@Param('id') id: string): Promise<void> {
    await this.postingsService.increaseLikeCount(id);
  }

  @Patch(':id/share')
  @HttpCode(HttpStatus.NO_CONTENT) //성공시 204 No Content
  async sharePosting(@Param('id') id: string): Promise<void> {
    await this.postingsService.increaseShareCount(id);
  }
}
