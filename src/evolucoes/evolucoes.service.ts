// src/evolucoes/evolucoes.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateEvolucaoDto } from './dto/create-evolucao.dto';
import { PrismaService } from '../prisma.service';

// 1. CORREÇÃO: Imports combinados em uma única linha
import { Prisma, NomePapel, TipoEvolucao, Usuario } from '@prisma/client';

@Injectable()
export class EvolucoesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Helper: Valida o paciente e a clínica
   */
  private async validarPaciente(pacienteId: number, clinicaId: number) {
    const paciente = await this.prisma.paciente.findFirst({
      where: { id: pacienteId, clinicaId: clinicaId },
    });
    if (!paciente) {
      throw new NotFoundException('Paciente não encontrado nesta clínica.');
    }
    return paciente;
  }

  /**
   * CRIAR uma nova Evolução (com etiqueta de sigilo)
   */
  async create(
    dto: CreateEvolucaoDto,
    pacienteId: number,
    usuarioLogado: any, // 2. CORREÇÃO: Mudado de 'Usuario' para 'any'
  ) {
    await this.validarPaciente(pacienteId, usuarioLogado.clinicaId);

    // --- LÓGICA DE SIGILO (create) ---
    let tipo: TipoEvolucao = TipoEvolucao.GERAL;
    const papelUsuario = usuarioLogado.papel.nome; // Esta linha agora funciona

    if (papelUsuario === NomePapel.PSICOLOGO) {
      tipo = TipoEvolucao.PSICOLOGICA;
    } else if (papelUsuario === NomePapel.TERAPEUTA) {
      tipo = TipoEvolucao.TERAPEUTICA;
    }
    // --- FIM DA LÓGICA ---

    return this.prisma.evolucao.create({
      data: {
        descricao: dto.descricao,
        pacienteId: pacienteId,
        usuarioId: usuarioLogado.id,
        tipo: tipo,
      },
      include: {
        usuario: {
          select: {
            nome_completo: true,
            papel: { select: { nome: true } },
          },
        },
      },
    });
  }

  /**
   * LISTAR evoluções (com filtro de sigilo)
   */
  async findAllByPaciente(
    pacienteId: number,
    usuarioLogado: any, // 3. CORREÇÃO: Mudado de 'Usuario' para 'any'
  ) {
    await this.validarPaciente(pacienteId, usuarioLogado.clinicaId);

    const papelUsuario = usuarioLogado.papel.nome; // Esta linha agora funciona

    // --- LÓGICA DE SIGILO (read) ---
    const tiposVisiveis: TipoEvolucao[] = [
      TipoEvolucao.GERAL,
    ];

    if (papelUsuario === NomePapel.PSICOLOGO) {
      tiposVisiveis.push(TipoEvolucao.PSICOLOGICA);
    }
    
    if (papelUsuario === NomePapel.TERAPEUTA) {
      tiposVisiveis.push(TipoEvolucao.TERAPEUTICA);
    }

    if (
      papelUsuario === NomePapel.ADMINISTRADOR ||
      papelUsuario === NomePapel.COORDENADOR ||
      papelUsuario === NomePapel.MEDICO
    ) {
      tiposVisiveis.push(TipoEvolucao.PSICOLOGICA, TipoEvolucao.TERAPEUTICA);
    }
    // --- FIM DA LÓGICA ---

    return this.prisma.evolucao.findMany({
      where: {
        pacienteId: pacienteId,
        tipo: {
          in: tiposVisiveis,
        },
      },
      orderBy: {
        data_evolucao: 'desc',
      },
      include: {
        usuario: {
          select: {
            nome_completo: true,
            papel: { select: { nome: true } },
          },
        },
      },
    });
  }
}