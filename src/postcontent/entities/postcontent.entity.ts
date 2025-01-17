import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PostContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @Column()
  type: string;

  @Column()
  postId: number;
}
