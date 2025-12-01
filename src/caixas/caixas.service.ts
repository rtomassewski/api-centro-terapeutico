// src/caixas/caixas.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service'; // Ajuste o caminho se necessário
import { AbrirCaixaDto } from './dto/abrir-caixa.dto';
import { FecharCaixaDto } from './dto/fechar-caixa.dto';
import { StatusCaixa } from '@prisma/client';

@Injectable()
export class CaixasService {
  constructor(private readonly prisma: PrismaService) {}

  // 1. Verificar Status Hoje
  async verificarStatusHoje(usuarioId: number) {
    console.log(`[DEBUG] Verificando caixa para Usuário ID: ${usuarioId}`);
    
    const caixaAberto = await this.prisma.caixa.findFirst({
      where: {
        usuarioId: usuarioId,
        status: StatusCaixa.ABERTO,
      },
    });

    console.log(`[DEBUG] Resultado da busca: ${caixaAberto ? 'ACHOU CAIXA ID ' + caixaAberto.id : 'NENHUM CAIXA ABERTO'}`);
    return caixaAberto; 
  }

  // 2. Abrir Caixa
  async abrir(usuarioId: number, clinicaId: number, dto: AbrirCaixaDto) {
    const caixaAberto = await this.verificarStatusHoje(usuarioId);
    if (caixaAberto) {
      throw new BadRequestException('Você já possui um caixa aberto.');
    }

    return await this.prisma.caixa.create({
      data: {
        usuarioId,
        clinicaId,
        saldo_inicial: dto.saldo_inicial,
        status: StatusCaixa.ABERTO,
        observacoes: dto.observacoes,
        data_abertura: new Date(),
      },
    });
  }

  // 3. Fechar Caixa
  async fechar(usuarioId: number, dto: FecharCaixaDto) {
    const caixaAberto = await this.verificarStatusHoje(usuarioId);
    
    if (!caixaAberto) {
      // Se caiu aqui, é porque o verificarStatusHoje retornou null
      console.log(`[ERRO] Tentativa de fechar caixa falhou. UsuarioID: ${usuarioId}`);
      throw new BadRequestException('Não há caixa aberto para fechar.');
    }

    return await this.prisma.caixa.update({
      where: { id: caixaAberto.id },
      data: {
        status: StatusCaixa.FECHADO,
        saldo_final: dto.saldo_final,
        data_fechamento: new Date(),
      },
    });
  }
}