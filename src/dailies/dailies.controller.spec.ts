import { Test, TestingModule } from '@nestjs/testing';
import { DailiesController } from './dailies.controller';

describe('DailiesController', () => {
  let controller: DailiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DailiesController],
    }).compile();

    controller = module.get<DailiesController>(DailiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
