import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Posting } from 'src/entities/posting.entity';
import { PostingResponseDto } from './dto/posting-response.dto';
import { PostingQueryDto } from './dto/posting-query.dto';

@Injectable()
export class PostingsService {
  constructor(@InjectRepository(Posting) private readonly postingRepository: Repository<Posting>) {}

  /**
   * 게시물의 목록을 조회합니다. content는 20자 까지만 조회됩니다.
   * @param queries
   * @returns 게시물 목록. 없는 경우 빈 배열
   */
  async findAll(hashtag: string, queries: PostingQueryDto): Promise<PostingResponseDto[]> {
    const { type, orderBy, sortOrder, searchBy, search, pageCount, page } = queries;
    const queryBuilder = this.postingRepository.createQueryBuilder('posting');

    // 1건의 hashtag와 정확히 일치하는 값 검색
    queryBuilder
      .innerJoinAndSelect('posting.postingHashtags', 'postingHashtag')
      .innerJoinAndSelect('postingHashtag.hashtag', 'hashtag')
      .where('hashtag.name = :hashtag', { hashtag });

    // 게시물의 type 별로 조회, 미입력 시 모든 type
    if (type) {
      queryBuilder.andWhere('posting.type = :type', { type });
    }

    // search 입력된 경우 searchBy에 따라 검색
    if (search) {
      if (searchBy.split(',').length === 2) {
        queryBuilder.andWhere('posting.title LIKE :search OR posting.content LIKE :search', { search: `%${search}%` });
      } else {
        queryBuilder.andWhere(`posting.${searchBy} LIKE :search`, { search: `%${search}%` });
      }
    }

    // 입력된 값대로 정렬해 페이지네이션
    const postings = await queryBuilder
      .orderBy(`posting.${orderBy}`, sortOrder)
      .skip(page * pageCount)
      .take(pageCount)
      .getMany();

    // hashtag depth 정리 & content 글자 수 제한 적용해 반환
    return postings.map((posting) => {
      const arrangedPosting = this.getPostingObjWithHashtags(posting);
      arrangedPosting.content = arrangedPosting.content.substring(0, 20);

      return arrangedPosting;
    });
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
