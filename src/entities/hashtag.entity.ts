import { Column, Entity, OneToMany } from 'typeorm';
import { PostingHashtag } from './posting-hashtag.entity';
import { BaseModel } from './base-model.entity';

@Entity()
export class Hashtag extends BaseModel {
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;

  @OneToMany(() => PostingHashtag, (postingHashtag) => postingHashtag.hashtag)
  postingHashtags: PostingHashtag[];
}
