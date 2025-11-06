import { Test, TestingModule } from '@nestjs/testing';
import { SaidasEstoqueService } from './saidas-estoque.service';

describe('SaidasEstoqueService', () => {
  let service: SaidasEstoqueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SaidasEstoqueService],
    }).compile();

    service = module.get<SaidasEstoqueService>(SaidasEstoqueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
