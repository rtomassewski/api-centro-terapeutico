import { Test, TestingModule } from '@nestjs/testing';
import { NotasComportamentoService } from './notas-comportamento.service';

describe('NotasComportamentoService', () => {
  let service: NotasComportamentoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotasComportamentoService],
    }).compile();

    service = module.get<NotasComportamentoService>(NotasComportamentoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
