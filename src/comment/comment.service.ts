import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { PostsService } from '../posts/posts.service';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    private usersService: UsersService,
    @Inject(forwardRef(() => PostsService))
    private postService: PostsService,
  ) {}

  async create(createCommentDto: CreateCommentDto, userId: number) {
    const user = await this.usersService.findById(userId);
    const post = await this.postService.findById(createCommentDto.postId);
    return this.commentRepository.save({
      text: createCommentDto.text,
      postId: post.id,
      userId: user.id,
    });
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const existingComment = await this.commentRepository.findOneBy({ id });
    if (!existingComment) {
      throw new Error('Comment not found');
    }
    return this.commentRepository.save({
      ...existingComment,
      ...updateCommentDto,
    });
  }

  remove(id: number) {
    return this.commentRepository.delete({ id });
  }

  async findByPost(postId: number) {
    return this.commentRepository.find({
      where: {
        postId,
      },
    });
  }

  async countComments(postId: number) {
    return this.commentRepository.count({
      where: {
        postId,
      },
    });
  }
}
