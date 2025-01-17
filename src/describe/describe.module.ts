import { Module } from '@nestjs/common';
import { DescribeService } from './describe.service';
import { DescribeController } from './describe.controller';
import { FileUploadModule } from '../file-upload/file-upload.module';

@Module({
  controllers: [DescribeController],
  providers: [DescribeService],
  imports: [FileUploadModule],
})
export class DescribeModule {}
