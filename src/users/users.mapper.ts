import { User } from './entities/user.entity';
import { UserResponse } from './dto/user-response.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersMapper {
  mapUserToUserResponse(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }
}
