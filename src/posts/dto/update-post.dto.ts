import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { ContentsDto } from '../../postcontent/dto/contents.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  caption: string;
  contents: ContentsDto[];
}
