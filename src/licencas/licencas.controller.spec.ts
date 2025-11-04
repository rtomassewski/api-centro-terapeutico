import { Test, TestingModule } from '@nestjs/testing';
import { LicencasController } from './licencas.controller';
import { LicencasService } from './licencas.service';

describe('LicencasController', () => {
  let controller: LicencasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LicencasController],
      providers: [LicencasService],
    }).compile();

    controller = module.get<LicencasController>(LicencasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
