// src/evolucoes/evolucoes.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateEvolucaoDto } from './dto/create-evolucao.dto';
import { Usuario } from '@prisma/client';

@Injectable()
export class EvolucoesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Função privada para validar se o paciente existe E pertence à clínica do usuário
   */
  private async validarPaciente(pacienteId: number, clinicaId: number) {
    const paciente = await this.prisma.paciente.findFirst({
      where: {
        id: pacienteId,
        clinicaId: clinicaId,
      },
    });

    if (!paciente) {
      throw new NotFoundException(
        'Paciente não encontrado ou não pertence a esta clínica.',
      );
    }
    return paciente;
  }

  // --- MÉTODO create ATUALIZADO ---
  async create(
    dto: CreateEvolucaoDto,
    pacienteId: number,
    usuarioLogado: Usuario,
  ) {
    await this.validarPaciente(pacienteId, usuarioLogado.clinicaId);

    return this.prisma.evolucao.create({
      data: {
        descricao: dto.descricao,
        pacienteId: pacienteId,
        usuarioId: usuarioLogado.id,
      }, // <--- VÍRGULA CORRIGIDA (Erro 1)
      include: {
        // (Este é o seu código que estava na linha 40)
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
  } // <--- CHAVE DE FECHAMENTO CORRIGIDA (Erros 2-7)

  // --- MÉTODO findAllByPaciente ATUALIZADO ---
  async findAllByPaciente(pacienteId: number, usuarioLogado: Usuario) {
    await this.validarPaciente(pacienteId, usuarioLogado.clinicaId);

    return this.prisma.evolucao.findMany({
      where: {
        pacienteId: pacienteId,
      },
      orderBy: {
        data_evolucao: 'desc',
      },
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
