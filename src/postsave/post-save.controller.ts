import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { PostSaveService } from './post-save.service';
import { PostSaveDto } from './dto/post-save.dto';
import { Request } from 'express';
import { getAuthenticatedUserId } from '../util/RequestUtil';
import { Response } from 'express';

@Controller('post-save')
export class PostSaveController {
  constructor(private readonly postSaveService: PostSaveService) {}

  @Post()
  async create(
    @Body() postSaveDto: PostSaveDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.postSaveService.toggle(postSaveDto, getAuthenticatedUserId(req));
    return res.status(200).send();
  }
}
