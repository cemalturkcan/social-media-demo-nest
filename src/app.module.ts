import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CreateDatabaseConnection } from './config/db/Database';
import { DataSource } from 'typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { PostsModule } from './posts/posts.module';
import { CommentModule } from './comment/comment.module';
import { PostContentModule } from './postcontent/post-content.module';
import { LikeModule } from './like/like.module';
import { PostSaveModule } from './postsave/post-save.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { TranslateModule } from './translate/translate.module';
import { Module } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { DescribeModule } from './describe/describe.module';

@Module({
  imports: [
    CreateDatabaseConnection(),
    MailerModule.forRootAsync({
      useFactory: () => {
        return {
          transport: {
            service: 'gmail',
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASSWORD,
            },
          },
        };
      },
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    PostContentModule,
    LikeModule,
    CommentModule,
    PostSaveModule,
    FileUploadModule,
    TranslateModule,
    RedisModule,
    DescribeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
