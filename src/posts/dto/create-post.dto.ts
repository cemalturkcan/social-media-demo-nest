import { ContentsDto } from '../../postcontent/dto/contents.dto';

export class CreatePostDto {
  caption: string;
  contents: ContentsDto[];
}
