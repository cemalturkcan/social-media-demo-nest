import { Injectable } from '@nestjs/common';
import { PostSaveDto } from './dto/post-save.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostSave } from './entities/post-save.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PostSaveService {
  constructor(
    @InjectRepository(PostSave)
    private postSaveRepository: Repository<PostSave>,
  ) {}

  async toggle(postSaveDto: PostSaveDto, userId: number) {
    const existingPostSave = await this.postSaveRepository.findOne({
      where: {
        postId: postSaveDto.postId,
        userId,
      },
    });
    if (existingPostSave) {
      return this.postSaveRepository.remove(existingPostSave);
    }
    return this.postSaveRepository.save({
      ...postSaveDto,
      userId,
    });
  }

  async isSaved(id: number, userId: number) {
    const existingPostSave = await this.postSaveRepository.findOne({
      where: {
        postId: id,
        userId,
      },
    });
    return !!existingPostSave;
  }
}
