import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PacientesModule } from './pacientes/pacientes.module';
import { AuthModule } from './auth/auth.module';
import { EvolucoesModule } from './evolucoes/evolucoes.module';
import { PrescricoesModule } from './prescricoes/prescricoes.module';
import { ClinicasModule } from './clinicas/clinicas.module';
import { ConfigModule } from '@nestjs/config';
import { LicencasModule } from './licencas/licencas.module';
import { PagamentosModule } from './pagamentos/pagamentos.module';
import { CategoriasFinanceirasModule } from './categorias-financeiras/categorias-financeiras.module';

@Module({
  imports: [ConfigModule.forRoot({
      isGlobal: true, 
    }), UsuariosModule, PacientesModule, AuthModule, EvolucoesModule, PrescricoesModule, ClinicasModule, LicencasModule, PagamentosModule, CategoriasFinanceirasModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
