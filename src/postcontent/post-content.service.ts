import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostContent } from './entities/postcontent.entity';
import { ContentsDto } from './dto/contents.dto';

@Injectable()
export class PostContentService {
  constructor(
    @InjectRepository(PostContent)
    private postContentRepository: Repository<PostContent>,
  ) {}

  async findAllByPostId(id: number) {
    return this.postContentRepository.find({ where: { postId: id } });
  }

  createAll(contents: ContentsDto[]) {
    return this.postContentRepository.save(contents);
  }

  async remove(numbers: number[]) {
    if (numbers.length === 0) {
      return;
    }
    return this.postContentRepository.delete(numbers);
  }
}
