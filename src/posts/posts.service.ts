import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { PostCalculatedDto } from './dto/post-calculated.dto';
import { PostContentService } from '../postcontent/post-content.service';
import { FileUploadService } from '../file-upload/file-upload.service';
import { ContentsDto } from '../postcontent/dto/contents.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private postContentService: PostContentService,
    private fileUploadService: FileUploadService,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    userId: number,
    files: Express.Multer.File[],
  ) {
    const post = await this.postRepository.save({
      caption: createPostDto.caption,
      userId: userId,
    });

    const uploads = this.fileUploadService
      .handleUploadedFiles(files)
      .map((file) => {
        return {
          postId: post.id,
          type: file.mimetype,
          url: file.url,
        } as ContentsDto;
      });
    await this.postContentService.createAll(uploads);
    return this.calculatePostDetails(post.id, userId);
  }

  async update(
    id: number,
    updatePostDto: UpdatePostDto,
    userId: number,
    files: Express.Multer.File[],
  ) {
    const existingPost = await this.findByIdOrThrow(id);
    if (existingPost && existingPost.userId !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to update this post',
      );
    }
    const oldContents = await this.postContentService.findAllByPostId(id);
    const deletedContents = oldContents.filter(
      (content) => !updatePostDto.contents.some((c) => c.id === content.id),
    );
    await this.postContentService.remove(deletedContents.map((c) => c.id));
    this.fileUploadService.deleteFiles(deletedContents.map((c) => c.url));
    const uploads = this.fileUploadService
      .handleUploadedFiles(files)
      .map((file) => {
        return {
          postId: id,
          type: file.mimetype,
          url: file.url,
        } as ContentsDto;
      });

    await this.postContentService.createAll(uploads);
    await this.postRepository.update(id, {
      caption: updatePostDto.caption,
      userId: userId,
    });
    return this.calculatePostDetails(id, userId);
  }

  async findAll(userId: number): Promise<PostCalculatedDto[]> {
    const posts = await this.postRepository.find();
    return await Promise.all(
      posts.map((post) => this.calculatePostDetails(post.id, userId)),
    );
  }

  private async calculatePostDetails(
    postId: number,
    userId: number,
  ): Promise<PostCalculatedDto> {
    const result = await this.postRepository.manager.query(
      `SELECT post.id                                                                                    AS post_id,
              post.caption,
              usr.id                                                                                     AS user_id,
              usr.name                                                                                   AS user_name,
              usr.email                                                                                  AS user_email,
              COUNT(DISTINCT likes.id)                                                                   AS likeCount,
              COUNT(DISTINCT comment.id)                                                                 AS commentCount,
              EXISTS (SELECT 1 FROM post_save WHERE post_save.userId = ? AND post_save.postId = post.id) AS isSaved,
              EXISTS (SELECT 1 FROM likes WHERE likes.userId = ? AND likes.postId = post.id)             AS isLiked,
              CASE
                  WHEN COUNT(content.id) > 0 THEN CONCAT('[',
                                                         GROUP_CONCAT(JSON_OBJECT('id', content.id, 'url', content.url,
                                                                                  'type', content.type) SEPARATOR ','),
                                                         ']')
                  ELSE '[]'
                  END                                                                                    AS contents
       FROM post
                LEFT JOIN usr ON usr.id = post.userId
                LEFT JOIN likes ON likes.postId = post.id
                LEFT JOIN comment ON comment.postId = post.id
                LEFT JOIN post_content content ON content.postId = post.id
       WHERE post.id = ?
       GROUP BY post.id, usr.id;
      `,
      [userId, userId, postId],
    );

    const post = result[0];
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return {
      id: post.post_id,
      caption: post.caption,
      user: {
        id: post.user_id,
        name: post.user_name,
        email: post.user_email,
      },
      contents: post.contents ? JSON.parse(post.contents) : [],
      likeCount: Number(post.likeCount),
      commentCount: Number(post.commentCount),
      isSaved: post.isSaved === '1',
      isLiked: post.isLiked === '1',
    };
  }

  async remove(id: number, userId: number) {
    const post = await this.findByIdOrThrow(id);
    if (post.userId !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to delete this post',
      );
    }
    return this.postRepository.remove(post);
  }

  async findByIdOrThrow(id: number): Promise<Post> {
    const post = await this.postRepository.findOneBy({ id });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  async findById(id: number): Promise<Post | undefined> {
    return this.postRepository.findOneBy({ id });
  }
}
