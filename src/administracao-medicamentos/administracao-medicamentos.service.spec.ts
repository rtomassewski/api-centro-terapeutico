import { Test, TestingModule } from '@nestjs/testing';
import { AdministracaoMedicamentosService } from './administracao-medicamentos.service';

describe('AdministracaoMedicamentosService', () => {
  let service: AdministracaoMedicamentosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdministracaoMedicamentosService],
    }).compile();

    service = module.get<AdministracaoMedicamentosService>(AdministracaoMedicamentosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
