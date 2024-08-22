import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PostingHashtag } from './posting-hashtag.entity';

@Entity()
export class Hashtag {
  @PrimaryGeneratedColumn('uuid')
  hashtagId: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => PostingHashtag, (postingHashtag) => postingHashtag.hashtag)
  postingHashtags: PostingHashtag[];
}
