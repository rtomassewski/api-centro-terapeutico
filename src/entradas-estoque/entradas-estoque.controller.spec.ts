import { Test, TestingModule } from '@nestjs/testing';
import { EntradasEstoqueController } from './entradas-estoque.controller';
import { EntradasEstoqueService } from './entradas-estoque.service';

describe('EntradasEstoqueController', () => {
  let controller: EntradasEstoqueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EntradasEstoqueController],
      providers: [EntradasEstoqueService],
    }).compile();

    controller = module.get<EntradasEstoqueController>(EntradasEstoqueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
