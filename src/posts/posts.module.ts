import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { LikeModule } from '../like/like.module';
import { CommentModule } from '../comment/comment.module';
import { PostSaveModule } from '../postsave/post-save.module';
import { PostContentModule } from '../postcontent/post-content.module';
import { FileUploadModule } from '../file-upload/file-upload.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Post]),
    LikeModule,
    CommentModule,
    PostSaveModule,
    PostContentModule,
    FileUploadModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
