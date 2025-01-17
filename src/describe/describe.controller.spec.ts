import { Test, TestingModule } from '@nestjs/testing';
import { DescribeController } from './describe.controller';
import { DescribeService } from './describe.service';

describe('DescribeController', () => {
  let controller: DescribeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DescribeController],
      providers: [DescribeService],
    }).compile();

    controller = module.get<DescribeController>(DescribeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
