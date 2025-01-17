import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Request, Response } from 'express';
import { getAuthenticatedUserId } from '../util/RequestUtil';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @Req() req: Request) {
    return this.commentService.create(
      createCommentDto,
      getAuthenticatedUserId(req),
    );
  }

  @Get('by-post/:postId')
  findByPost(@Param('postId') postId: string) {
    return this.commentService.findByPost(+postId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: Response) {
    await this.commentService.remove(+id);
    return res.status(204).send();
  }
}
