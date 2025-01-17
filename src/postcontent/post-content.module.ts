import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostContentService } from './post-content.service';
import { PostContent } from './entities/postcontent.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostContent])],
  providers: [PostContentService],
  exports: [PostContentService],
})
export class PostContentModule {}
