import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Posting } from 'src/entities/posting.entity';
import { PostingResponseDto } from './dto/posting-response.dto';

@Injectable()
export class PostingsService {
  constructor(@InjectRepository(Posting) private readonly postingRepository: Repository<Posting>) {}

  /**
   * 게시물의 목록을 조회합니다. content는 20자 까지만 조회됩니다.
   * @returns 게시물 목록. 없는 경우 빈 배열
   */
  async findAll(): Promise<PostingResponseDto[]> {
    return [new PostingResponseDto()];
  }

  /**
   * 게시물을 상세 조회합니다. 조회수가 1씩 증가합니다.
   * @param id 게시물 PK(uuid)
   * @returns id에 해당하는 게시물
   */
  async findOne(id: string): Promise<PostingResponseDto> {
    const posting = await this.postingRepository
      .createQueryBuilder('posting')
      .leftJoinAndSelect('posting.postingHashtags', 'postingHashtag')
      .leftJoinAndSelect('postingHashtag.hashtag', 'hashtag')
      .where('posting.id = :id', { id })
      .getOne();

    if (!posting) {
      throw new NotFoundException('posting not found');
    }
    this.postingRepository.update(id, { viewCount: posting.viewCount + 1 });

    return this.getPostingObjWithHashtags(posting);
  }

  // 조인으로 인한 hashtag의 depth를 정리한 새 객체를 반환합니다.
  private getPostingObjWithHashtags(postingObj: Posting): PostingResponseDto {
    const hashtags: string[] = [];
    if (postingObj.postingHashtags.length) {
      postingObj.postingHashtags.forEach((v) => {
        hashtags.push(v.hashtag.name);
      });
    }

    return {
      id: postingObj.id,
      contentId: postingObj.contentId,
      type: postingObj.type,
      title: postingObj.title,
      content: postingObj.content,
      writer: postingObj.writer,
      hashtags,
      viewCount: postingObj.viewCount,
      likeCount: postingObj.likeCount,
      shareCount: postingObj.shareCount,
      createdAt: postingObj.createdAt,
      updatedAt: postingObj.updatedAt,
    };
  }
}
