import { Controller, Get, Param, Query, Request } from '@nestjs/common';
import { PostingsService } from './postings.service';
import { PostingResponseDto } from './dto/posting-response.dto';
import { PostingQueryDto } from './dto/posting-query.dto';

@Controller('postings')
export class PostingsController {
  constructor(private readonly postingsService: PostingsService) {}

  // TODO: AuthGuard 적용
  @Get()
  async findAll(@Request() req: any, @Query() queries: PostingQueryDto): Promise<PostingResponseDto[]> {
    // TODO: any 해결
    const hashtag = queries.hashtag || req.user.accountName;
    return await this.postingsService.findAll(hashtag, queries);
  }

  // TODO: AuthGuard 적용
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PostingResponseDto> {
    return await this.postingsService.findOne(id);
  }
}
