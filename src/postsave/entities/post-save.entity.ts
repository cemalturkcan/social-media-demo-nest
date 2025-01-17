import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class PostSave {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  postId: number;
  @Column()
  userId: number;
}
