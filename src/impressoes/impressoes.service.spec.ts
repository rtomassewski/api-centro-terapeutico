import { Test, TestingModule } from '@nestjs/testing';
import { ImpressoesService } from './impressoes.service';

describe('ImpressoesService', () => {
  let service: ImpressoesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImpressoesService],
    }).compile();

    service = module.get<ImpressoesService>(ImpressoesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
