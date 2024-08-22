import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { PostingHashtag } from './posting-hashtag.entity';

export enum SocialNetworkType {
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  INSTAGRAM = 'instagram',
  YOUTUBE = 'youtube',
}

@Entity()
@Unique(['type', 'contentId'])
export class Posting {
  @PrimaryGeneratedColumn('uuid')
  postingId: string;

  @Column({ type: 'varchar', length: 255 })
  contentId: string;

  @Column({
    type: 'enum',
    enum: SocialNetworkType,
  })
  type: SocialNetworkType;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', length: 255 })
  writer: string;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ default: 0 })
  likeCount: number;

  @Column({ default: 0 })
  shareCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => PostingHashtag, (postingHashtag) => postingHashtag.posting)
  postingHashtags: PostingHashtag[];
}
