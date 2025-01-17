import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { Like } from './entities/like.entity';
import { PostsModule } from '../posts/posts.module';
import { Post } from '../posts/entities/post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Like, Post]),
    forwardRef(() => PostsModule),
  ],
  controllers: [LikeController],
  providers: [LikeService],
  exports: [LikeService],
})
export class LikeModule {}
