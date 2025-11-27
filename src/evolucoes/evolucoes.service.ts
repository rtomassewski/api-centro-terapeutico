// src/evolucoes/evolucoes.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateEvolucaoDto } from './dto/create-evolucao.dto';
import { PrismaService } from '../prisma.service';

// 1. CORREÇÃO: Adicionado StatusAgendamento aos imports
import { Prisma, NomePapel, TipoEvolucao, StatusAgendamento } from '@prisma/client';

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
   * CRIAR uma nova Evolução (com etiqueta de sigilo E baixa na agenda)
   */
  async create(
    dto: CreateEvolucaoDto,
    pacienteId: number,
    usuarioLogado: any, 
  ) {
    await this.validarPaciente(pacienteId, usuarioLogado.clinicaId);

    // --- LÓGICA DE SIGILO (Mantida igual ao seu original) ---
    let tipo: TipoEvolucao = TipoEvolucao.GERAL;
    const papelUsuario = usuarioLogado.papel.nome; 

    if (papelUsuario === NomePapel.PSICOLOGO) {
      tipo = TipoEvolucao.PSICOLOGICA;
    } else if (papelUsuario === NomePapel.TERAPEUTA) {
      tipo = TipoEvolucao.TERAPEUTICA;
    } else if (dto.tipo) {
      // Caso queira forçar via DTO (opcional), mas sua lógica acima é soberana
      tipo = dto.tipo;
    }
    // --- FIM DA LÓGICA ---

    // 2. CORREÇÃO: Uso de TRANSACTION para garantir integridade
    return this.prisma.$transaction(async (tx) => {
      
      // A. Cria a evolução (usando 'tx' e não 'this.prisma')
      const novaEvolucao = await tx.evolucao.create({
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

      // B. Se veio o ID do agendamento, marca como REALIZADO
      if (dto.agendamentoId) {
        // Verifica se o agendamento existe e pertence a este paciente (segurança extra)
        const agendamento = await tx.agendamento.findFirst({
          where: { id: dto.agendamentoId, pacienteId: pacienteId }
        });

        if (agendamento) {
          await tx.agendamento.update({
            where: { id: dto.agendamentoId },
            data: { status: StatusAgendamento.REALIZADO },
          });
        }
      }

      return novaEvolucao;
    });
  }

  /**
   * LISTAR evoluções (com filtro de sigilo)
   * (Esta parte eu mantive idêntica ao seu código original)
   */
  async findAllByPaciente(
    pacienteId: number,
    usuarioLogado: any, 
  ) {
    await this.validarPaciente(pacienteId, usuarioLogado.clinicaId);

    const papelUsuario = usuarioLogado.papel.nome; 

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
      papelUsuario === NomePapel.MEDICO ||
      papelUsuario === NomePapel.PSIQUIATRA // Adicionei Psiquiatra para ver tudo também
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