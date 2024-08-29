import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Posting } from 'src/entities/posting.entity';
import { Repository } from 'typeorm';
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
    const rawPostings = await this.getRawPostings(hashtag, queries);

    // hashtag depth 정리 & content 글자 수 제한 적용해 반환
    return rawPostings.map((rawPosting) => {
      const posting = this.getPostingObjWithHashtags(rawPosting);
      posting.content = posting.content.substring(0, 20);

      return posting;
    });
  }

  /**
   * 게시물을 상세 조회합니다. 조회수가 1씩 증가합니다.
   * @param id 게시물 PK(uuid)
   * @returns id에 해당하는 게시물
   */
  async findOne(id: string): Promise<PostingResponseDto> {
    const posting = await this.postingRepository.findOne({
      where: { id },
      relations: ['postingHashtags', 'postingHashtags.hashtag'],
    });

    if (posting === null) {
      throw new NotFoundException('posting not found');
    }
    this.postingRepository.update(id, { viewCount: posting.viewCount + 1 });

    return this.getPostingObjWithHashtags(posting);
  }

  // 입력된 쿼리 파라미터를 바탕으로 DB 쿼리를 빌드해 게시물 목록을 가져옵니다.
  private async getRawPostings(hashtag: string, queries: PostingQueryDto): Promise<Posting[]> {
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
    const rawPostings = await queryBuilder
      .orderBy(`posting.${orderBy}`, sortOrder)
      .skip(page * pageCount)
      .take(pageCount)
      .getMany();

    return rawPostings;
  }

  // 조인으로 인한 hashtag의 depth를 정리한 새 객체를 반환합니다.
  private getPostingObjWithHashtags(postingObj: Posting): PostingResponseDto {
    const hashtags: string[] = postingObj.postingHashtags.map((postingHashtag) => postingHashtag.hashtag.name);

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

  /**
   * 게시글의 좋아요 수(like_count)를 1 증가시킵니다.
   * @param id 게시글의 고유 ID (uuid)
   * @returns void
   */
  async increaseLikeCount(id: string): Promise<void> {
    const posting = await this.postingRepository.findOneBy({ id });

    //게시글이 존재하지 않는 경우
    if (posting === null) {
      throw new NotFoundException('The post does not exist.');
    }

    //좋아요 수만 1 증가
    const newLikeCount = posting.likeCount + 1;
    this.postingRepository.update(id, { likeCount: newLikeCount });
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
      throw new NotFoundException('The post does not exist.');
    }

    //공유 수만 1 증가
    const newShareCount = posting.shareCount + 1;
    this.postingRepository.update(id, { shareCount: newShareCount });
  }
}
