import { Test, TestingModule } from '@nestjs/testing';
import { AlasService } from './alas.service';

describe('AlasService', () => {
  let service: AlasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlasService],
    }).compile();

    service = module.get<AlasService>(AlasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
