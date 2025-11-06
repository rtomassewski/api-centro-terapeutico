import { Test, TestingModule } from '@nestjs/testing';
import { SinaisVitaisService } from './sinais-vitais.service';

describe('SinaisVitaisService', () => {
  let service: SinaisVitaisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SinaisVitaisService],
    }).compile();

    service = module.get<SinaisVitaisService>(SinaisVitaisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
