import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { CreateLikeDto } from './dto/create-like.dto';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
    @Inject(forwardRef(() => PostsService))
    private postService: PostsService,
  ) {}

  async toggle(dto: CreateLikeDto, userId: number) {
    await this.postService.findByIdOrThrow(dto.postId);

    const like = await this.likeRepository.findOne({
      where: {
        postId: dto.postId,
        userId,
      },
    });
    if (like) {
      await this.unlike(like);
      return;
    }

    return this.likeRepository.save({
      ...dto,
      userId,
    });
  }

  async unlike(like: Like) {
    await this.likeRepository.remove(like);
  }

  async isLiked(id: number, userId: number) {
    return !!(await this.likeRepository.findOne({
      where: {
        postId: id,
        userId,
      },
    }));
  }
}
