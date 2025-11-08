import { Test, TestingModule } from '@nestjs/testing';
import { NotasComportamentoController } from './notas-comportamento.controller';
import { NotasComportamentoService } from './notas-comportamento.service';

describe('NotasComportamentoController', () => {
  let controller: NotasComportamentoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotasComportamentoController],
      providers: [NotasComportamentoService],
    }).compile();

    controller = module.get<NotasComportamentoController>(NotasComportamentoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
