import { Test, TestingModule } from '@nestjs/testing';
import { LeitosController } from './leitos.controller';
import { LeitosService } from './leitos.service';

describe('LeitosController', () => {
  let controller: LeitosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LeitosController],
      providers: [LeitosService],
    }).compile();

    controller = module.get<LeitosController>(LeitosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
