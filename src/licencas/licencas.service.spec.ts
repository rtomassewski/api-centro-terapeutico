import { Test, TestingModule } from '@nestjs/testing';
import { LicencasService } from './licencas.service';

describe('LicencasService', () => {
  let service: LicencasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LicencasService],
    }).compile();

    service = module.get<LicencasService>(LicencasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
