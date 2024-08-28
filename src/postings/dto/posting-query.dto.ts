import { IsEnum, IsNotEmpty, IsNumberString, IsOptional } from 'class-validator';
import { SocialNetworkType } from 'src/entities/posting.entity';

enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}
enum OrderBy {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  LIKE_COUNT = 'likeCount',
  SHARE_COUNT = 'shareCount',
  VIEW_COUNT = 'viewCount',
}

enum SearchBy {
  TITLE = 'title',
  CONTENT = 'content',
  TITLE_CONTENT = 'title,content',
}

export class PostingQueryDto {
  @IsOptional()
  readonly hashtag?: string;

  @IsOptional()
  @IsEnum(SocialNetworkType)
  readonly type?: SocialNetworkType;

  @IsNotEmpty()
  @IsEnum(OrderBy)
  readonly orderBy: OrderBy = OrderBy.CREATED_AT;

  @IsNotEmpty()
  @IsEnum(SortOrder)
  readonly sortOrder: SortOrder = SortOrder.DESC;

  @IsNotEmpty()
  @IsEnum(SearchBy)
  readonly searchBy: SearchBy = SearchBy.TITLE_CONTENT;

  @IsOptional()
  readonly search?: string;

  @IsNotEmpty()
  @IsNumberString()
  readonly pageCount: number = 10;

  @IsNotEmpty()
  @IsNumberString()
  readonly page: number = 0;
}
