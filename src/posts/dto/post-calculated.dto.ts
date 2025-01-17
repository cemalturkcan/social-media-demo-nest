import { PostContent } from '../../postcontent/entities/postcontent.entity';
import { UserResponse } from '../../users/dto/user-response.dto';

export interface PostCalculatedDto {
  id: number;
  caption: string;
  user: UserResponse;
  contents: PostContent[];
  likeCount: number;
  commentCount: number;
  isSaved: boolean;
  isLiked: boolean;
}
