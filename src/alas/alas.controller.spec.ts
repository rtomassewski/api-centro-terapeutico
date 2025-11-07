import { Test, TestingModule } from '@nestjs/testing';
import { AlasController } from './alas.controller';
import { AlasService } from './alas.service';

describe('AlasController', () => {
  let controller: AlasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlasController],
      providers: [AlasService],
    }).compile();

    controller = module.get<AlasController>(AlasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
