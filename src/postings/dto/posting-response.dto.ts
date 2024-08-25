import { OmitType } from '@nestjs/mapped-types';
import { Posting } from 'src/entities/posting.entity';

export class PostingResponseDto extends OmitType(Posting, ['postingHashtags']) {}
