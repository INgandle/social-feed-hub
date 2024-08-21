import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Posting } from './posting.entity';
import { Hashtag } from './hashtag.entity';

@Entity()
@Unique(['postingId', 'hashtagId'])
export class PostingHashtag {
  @PrimaryGeneratedColumn('uuid')
  postingHashtagId: string;

  @Column({ type: 'varchar', length: 36 })
  postingId: string;

  @Column({ type: 'varchar', length: 36 })
  hashtagId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Posting)
  @JoinColumn({ name: 'posting_id' })
  posting: Posting;

  @ManyToOne(() => Hashtag)
  @JoinColumn({ name: 'hashtag_id' })
  hashtag: Hashtag;
}
