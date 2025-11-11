import { Test, TestingModule } from '@nestjs/testing';
import { ImpressoesController } from './impressoes.controller';

describe('ImpressoesController', () => {
  let controller: ImpressoesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImpressoesController],
    }).compile();

    controller = module.get<ImpressoesController>(ImpressoesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
