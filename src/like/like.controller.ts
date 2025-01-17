import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { LikeService } from './like.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { Request, Response } from 'express';
import { getAuthenticatedUserId } from '../util/RequestUtil';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  async toggle(
    @Body() dto: CreateLikeDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.likeService.toggle(dto, getAuthenticatedUserId(req));
    return res.status(200).send();
  }
}
