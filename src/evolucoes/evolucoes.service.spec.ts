import { Test, TestingModule } from '@nestjs/testing';
import { EvolucoesService } from './evolucoes.service';

describe('EvolucoesService', () => {
  let service: EvolucoesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EvolucoesService],
    }).compile();

    service = module.get<EvolucoesService>(EvolucoesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
