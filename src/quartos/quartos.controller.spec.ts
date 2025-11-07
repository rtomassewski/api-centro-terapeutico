import { Test, TestingModule } from '@nestjs/testing';
import { QuartosController } from './quartos.controller';
import { QuartosService } from './quartos.service';

describe('QuartosController', () => {
  let controller: QuartosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuartosController],
      providers: [QuartosService],
    }).compile();

    controller = module.get<QuartosController>(QuartosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
