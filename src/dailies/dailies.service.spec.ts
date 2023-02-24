import { Test, TestingModule } from '@nestjs/testing';
import { DailiesService } from './dailies.service';

describe('DailiesService', () => {
  let service: DailiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DailiesService],
    }).compile();

    service = module.get<DailiesService>(DailiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
