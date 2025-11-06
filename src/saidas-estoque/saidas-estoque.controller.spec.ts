import { Test, TestingModule } from '@nestjs/testing';
import { SaidasEstoqueController } from './saidas-estoque.controller';
import { SaidasEstoqueService } from './saidas-estoque.service';

describe('SaidasEstoqueController', () => {
  let controller: SaidasEstoqueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SaidasEstoqueController],
      providers: [SaidasEstoqueService],
    }).compile();

    controller = module.get<SaidasEstoqueController>(SaidasEstoqueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
