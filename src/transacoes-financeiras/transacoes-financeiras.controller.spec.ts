import { Test, TestingModule } from '@nestjs/testing';
import { TransacoesFinanceirasController } from './transacoes-financeiras.controller';
import { TransacoesFinanceirasService } from './transacoes-financeiras.service';

describe('TransacoesFinanceirasController', () => {
  let controller: TransacoesFinanceirasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransacoesFinanceirasController],
      providers: [TransacoesFinanceirasService],
    }).compile();

    controller = module.get<TransacoesFinanceirasController>(TransacoesFinanceirasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
