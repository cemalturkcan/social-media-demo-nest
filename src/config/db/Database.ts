import { TypeOrmModule } from '@nestjs/typeorm';
import * as process from 'node:process';
import { Comment } from '../../comment/entities/comment.entity';
import { Like } from '../../like/entities/like.entity';
import { Post } from '../../posts/entities/post.entity';
import { PostContent } from '../../postcontent/entities/postcontent.entity';
import { PostSave } from '../../postsave/entities/post-save.entity';
import { User } from '../../users/entities/user.entity';

export function CreateDatabaseConnection() {
  return TypeOrmModule.forRootAsync({
    useFactory: () => ({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: process.env.DATABASE_USER_NAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [Comment, Like, Post, PostContent, PostSave, User],
      synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    }),
  });
}
