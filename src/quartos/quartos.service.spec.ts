import { Test, TestingModule } from '@nestjs/testing';
import { QuartosService } from './quartos.service';

describe('QuartosService', () => {
  let service: QuartosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuartosService],
    }).compile();

    service = module.get<QuartosService>(QuartosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
