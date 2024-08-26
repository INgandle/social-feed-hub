import { Controller, HttpCode, HttpStatus, Param, Patch } from '@nestjs/common';
import { PostingsService } from './postings.service';

@Controller('postings')
export class PostingsController {
  constructor(private readonly postingsService: PostingsService) {}

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
