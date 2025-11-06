import { Test, TestingModule } from '@nestjs/testing';
import { AdministracaoMedicamentosController } from './administracao-medicamentos.controller';
import { AdministracaoMedicamentosService } from './administracao-medicamentos.service';

describe('AdministracaoMedicamentosController', () => {
  let controller: AdministracaoMedicamentosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdministracaoMedicamentosController],
      providers: [AdministracaoMedicamentosService],
    }).compile();

    controller = module.get<AdministracaoMedicamentosController>(AdministracaoMedicamentosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
