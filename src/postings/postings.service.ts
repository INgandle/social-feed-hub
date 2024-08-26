import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posting } from 'src/entities/posting.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostingsService {
  constructor(@InjectRepository(Posting) private readonly postingRepository: Repository<Posting>) {}

  /**
   * 게시글의 좋아요 수(like_count)를 1 증가시킵니다.
   * @param id 게시글의 고유 ID (uuid)
   * @returns void
   */
  async increaseLikeCount(id: string): Promise<void> {
    const posting = await this.postingRepository.findOneBy({ id });

    //게시글이 존재하지 않는 경우
    if (posting === null) {
      throw new NotFoundException('존재하지 않는 게시글입니다.');
    }

    //좋아요 수만 1 증가
    const newLikeCount = posting.likeCount + 1;
    await this.postingRepository.update(id, { likeCount: newLikeCount });
  }

  /**
   * 게시글 공유하기(share_count) 수를 1 증가시킵니다.
   * @param id 게시글의 고유 ID (uuid)
   * @returns void
   */
  async increaseShareCount(id: string): Promise<void> {
    const posting = await this.postingRepository.findOneBy({ id });

    //게시글이 존재하지 않는 경우
    if (posting === null) {
      throw new NotFoundException('존재하지 않는 게시글입니다.');
    }

    //공유 수만 1 증가
    const newShareCount = posting.shareCount + 1;
    await this.postingRepository.update(id, { shareCount: newShareCount });
  }
}
