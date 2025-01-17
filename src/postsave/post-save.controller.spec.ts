import { Test, TestingModule } from '@nestjs/testing';
import { PostSaveController } from './post-save.controller';
import { PostSaveService } from './post-save.service';

describe('PostSaveController', () => {
  let controller: PostSaveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostSaveController],
      providers: [PostSaveService],
    }).compile();

    controller = module.get<PostSaveController>(PostSaveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
