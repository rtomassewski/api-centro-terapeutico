import { Test, TestingModule } from '@nestjs/testing';
import { HistoricoMedicoService } from './historico-medico.service';

describe('HistoricoMedicoService', () => {
  let service: HistoricoMedicoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HistoricoMedicoService],
    }).compile();

    service = module.get<HistoricoMedicoService>(HistoricoMedicoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
