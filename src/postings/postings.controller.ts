import { Controller } from '@nestjs/common';
import { PostingsService } from './postings.service';

@Controller('postings')
export class PostingsController {
  constructor(private readonly postingsService: PostingsService) {}
}
