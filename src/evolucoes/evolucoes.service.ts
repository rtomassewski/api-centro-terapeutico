// src/evolucoes/evolucoes.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateEvolucaoDto } from './dto/create-evolucao.dto';

@Injectable()
export class EvolucoesService {
  
  constructor(private prisma: PrismaService) {}

  async create(
    dto: CreateEvolucaoDto,
    pacienteId: number,
    usuarioId: number, // O ID do profissional logado
  ) {
    // O schema.prisma já define que evolucao precisa de 'usuarioId' e 'pacienteId'
    return this.prisma.evolucao.create({
      data: {
        descricao: dto.descricao,
        pacienteId: pacienteId,
        usuarioId: usuarioId,
      },
      // Vamos incluir os dados do profissional que escreveu
      include: {
        usuario: {
          select: {
            nome_completo: true,
            papel: {
              select: { nome: true }
            }
          }
        }
      }
    });
  }
}
