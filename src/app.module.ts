import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { PacientesModule } from './pacientes/pacientes.module';
import { AuthModule } from './auth/auth.module';
import { EvolucoesModule } from './evolucoes/evolucoes.module';

@Module({
  imports: [UsuariosModule, PacientesModule, AuthModule, EvolucoesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
