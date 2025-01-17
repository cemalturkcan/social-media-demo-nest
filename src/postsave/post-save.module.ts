import { Module } from '@nestjs/common';
import { PostSaveService } from './post-save.service';
import { PostSaveController } from './post-save.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostSave } from './entities/post-save.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PostSave])],
  controllers: [PostSaveController],
  providers: [PostSaveService],
  exports: [PostSaveService],
})
export class PostSaveModule {}
