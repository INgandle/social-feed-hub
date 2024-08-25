import _ from 'lodash';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Posting } from 'src/entities/posting.entity';
import { PostingResponseDto } from './dto/posting-response.dto';

@Injectable()
export class PostingsService {
  constructor(@InjectRepository(Posting) private readonly postingRepository: Repository<Posting>) {}

  async findAll(): Promise<PostingResponseDto[]> {}

  /**
   * 게시물을 상세 조회합니다. 조회수가 1씩 증가합니다.
   * @param id 게시물 PK(uuid)
   * @returns id에 해당하는 게시물
   */
  async findOne(id: string): Promise<PostingResponseDto> {
    const posting = await this.postingRepository.findOneBy({ id });

    if (_.isNil(posting)) {
      throw new NotFoundException('posting not found');
    }

    this.postingRepository.update(id, { likeCount: posting.likeCount + 1 });

    return posting;
  }
}
