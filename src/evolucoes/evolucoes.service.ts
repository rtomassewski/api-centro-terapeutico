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
async findAllByPaciente(pacienteId: number) {
    return this.prisma.evolucao.findMany({
      // 1. Filtra as evoluções para este paciente
      where: {
        pacienteId: pacienteId,
      },
      // 2. IMPORTANTE: Ordena pela data, da mais recente para a mais antiga
      orderBy: {
        data_evolucao: 'desc',
      },
      // 3. Inclui os dados do profissional que escreveu
      include: {
        usuario: {
          select: {
            nome_completo: true,
            papel: {
              select: { nome: true },
            },
          },
        },
      },
    });
  }
}
