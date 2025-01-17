import {
  Controller,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { DescribeService } from './describe.service';
import { Public } from '../auth/publicDecorator';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from '../file-upload/file-upload.service';
import * as fs from 'fs';

@Controller('describe')
export class DescribeController {
  constructor(private readonly objectDetectionService: DescribeService) {}

  @Post()
  @Public()
  @UseInterceptors(
    FilesInterceptor('files', 1, FileUploadService.getStorageOptions()),
  )
  async forgotPasswordStepTwo(@UploadedFiles() files: Express.Multer.File[]) {
    try {
      const buffer = fs.readFileSync(files[0].path);
      const labels =
        await this.objectDetectionService.detectObjectsOnImage(buffer);
      fs.unlinkSync(files[0].path);
      const setArray = Array.from(new Set(labels));
      console.log(setArray);
      return setArray;
      // make it set
    } catch (error: any) {}
  }
}
