import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { Posting } from './posting.entity';
import { Hashtag } from './hashtag.entity';
import { BaseModel } from './base-model.entity';

@Entity()
@Unique(['postingId', 'hashtagId'])
export class PostingHashtag extends BaseModel {
  @Column({ type: 'varchar', length: 36 })
  postingId: string;

  @Column({ type: 'varchar', length: 36 })
  hashtagId: string;

  @ManyToOne(() => Posting)
  @JoinColumn({ name: 'posting_id' })
  posting: Posting;

  @ManyToOne(() => Hashtag)
  @JoinColumn({ name: 'hashtag_id' })
  hashtag: Hashtag;
}
