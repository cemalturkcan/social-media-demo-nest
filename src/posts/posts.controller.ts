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
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { UpdatePostDto } from './dto/update-post.dto';
import { Request, Response } from 'express';
import { getAuthenticatedUserId } from '../util/RequestUtil';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from '../file-upload/file-upload.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 10, FileUploadService.getStorageOptions()),
  )
  create(
    @Body() body: any,
    @Req() req: Request,
    @UploadedFiles() newFiles: Express.Multer.File[],
  ) {
    let createPostDto: CreatePostDto;
    console.log(body.data);
    try {
      createPostDto = JSON.parse(body.data);
    } catch (ignored) {
      throw new Error('Invalid JSON');
    }

    return this.postsService.create(
      createPostDto,
      getAuthenticatedUserId(req),
      newFiles,
    );
  }

  @Put(':id')
  @UseInterceptors(
    FilesInterceptor('files', 10, FileUploadService.getStorageOptions()),
  )
  update(
    @Param('id') id: number,
    @Body() body: any,
    @Req() req: Request,
    @UploadedFiles() newFiles: Express.Multer.File[],
  ) {
    console.log(newFiles);
    let createPostDto: UpdatePostDto;
    try {
      createPostDto = JSON.parse(body.data);
    } catch (e) {
      throw new Error('Invalid JSON');
    }

    return this.postsService.update(
      id,
      createPostDto,
      getAuthenticatedUserId(req),
      newFiles,
    );
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.postsService.findAll(getAuthenticatedUserId(req));
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.postsService.remove(+id, getAuthenticatedUserId(req));
    return res.status(200).send();
  }
}
