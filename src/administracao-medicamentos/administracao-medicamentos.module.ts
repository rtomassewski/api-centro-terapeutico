import { Module } from '@nestjs/common';
import { AdministracaoMedicamentosService } from './administracao-medicamentos.service';
import { AdministracaoMedicamentosController } from './administracao-medicamentos.controller';
import { PrismaService } from '../prisma.service';

@Module({
  controllers: [AdministracaoMedicamentosController],
  providers: [AdministracaoMedicamentosService, PrismaService],
})
export class AdministracaoMedicamentosModule {}
