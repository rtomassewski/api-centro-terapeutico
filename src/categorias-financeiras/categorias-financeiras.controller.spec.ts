import { Test, TestingModule } from '@nestjs/testing';
import { CategoriasFinanceirasController } from './categorias-financeiras.controller';
import { CategoriasFinanceirasService } from './categorias-financeiras.service';

describe('CategoriasFinanceirasController', () => {
  let controller: CategoriasFinanceirasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriasFinanceirasController],
      providers: [CategoriasFinanceirasService],
    }).compile();

    controller = module.get<CategoriasFinanceirasController>(CategoriasFinanceirasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
