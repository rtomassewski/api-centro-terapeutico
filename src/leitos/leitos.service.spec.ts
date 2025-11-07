import { Test, TestingModule } from '@nestjs/testing';
import { LeitosService } from './leitos.service';

describe('LeitosService', () => {
  let service: LeitosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LeitosService],
    }).compile();

    service = module.get<LeitosService>(LeitosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
