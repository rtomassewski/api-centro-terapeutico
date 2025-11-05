import { Test, TestingModule } from '@nestjs/testing';
import { TransacoesFinanceirasService } from './transacoes-financeiras.service';

describe('TransacoesFinanceirasService', () => {
  let service: TransacoesFinanceirasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransacoesFinanceirasService],
    }).compile();

    service = module.get<TransacoesFinanceirasService>(TransacoesFinanceirasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
