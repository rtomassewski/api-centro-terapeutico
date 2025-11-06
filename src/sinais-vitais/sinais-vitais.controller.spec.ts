import { Test, TestingModule } from '@nestjs/testing';
import { SinaisVitaisController } from './sinais-vitais.controller';
import { SinaisVitaisService } from './sinais-vitais.service';

describe('SinaisVitaisController', () => {
  let controller: SinaisVitaisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SinaisVitaisController],
      providers: [SinaisVitaisService],
    }).compile();

    controller = module.get<SinaisVitaisController>(SinaisVitaisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
