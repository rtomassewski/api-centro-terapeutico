import { Test, TestingModule } from '@nestjs/testing';
import { EntradasEstoqueService } from './entradas-estoque.service';

describe('EntradasEstoqueService', () => {
  let service: EntradasEstoqueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EntradasEstoqueService],
    }).compile();

    service = module.get<EntradasEstoqueService>(EntradasEstoqueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
