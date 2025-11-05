import { Test, TestingModule } from '@nestjs/testing';
import { CategoriasFinanceirasService } from './categorias-financeiras.service';

describe('CategoriasFinanceirasService', () => {
  let service: CategoriasFinanceirasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriasFinanceirasService],
    }).compile();

    service = module.get<CategoriasFinanceirasService>(CategoriasFinanceirasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
