import { Controller, Get, Param } from '@nestjs/common';
import { PostingsService } from './postings.service';
import { PostingResponseDto } from './dto/posting-response.dto';

@Controller('postings')
export class PostingsController {
  constructor(private readonly postingsService: PostingsService) {}

  @Get()
  async findAll(): Promise<PostingResponseDto[]> {
    return await this.postingsService.findAll();
  }

  // TODO: AuthGuard 적용
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<PostingResponseDto> {
    return await this.postingsService.findOne(id);
  }
}
