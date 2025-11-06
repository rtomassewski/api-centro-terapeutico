// src/agendamentos/agendamentos.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';
import { QueryAgendamentoDto } from './dto/query-agendamento.dto'; // Import do DTO de Query
import { PrismaService } from '../prisma.service';
import { Prisma, StatusAgendamento, Usuario } from '@prisma/client'; // Import dos tipos Prisma

@Injectable()
export class AgendamentosService {
  constructor(private prisma: PrismaService) {}

  /**
   * Helper: Valida se Paciente e Profissional existem e são da mesma clínica
   */
  private async validarEntidades(
    dto: CreateAgendamentoDto,
    clinicaId: number,
  ) {
    // 1. Valida Paciente
    const paciente = await this.prisma.paciente.findFirst({
      where: { id: dto.pacienteId, clinicaId: clinicaId },
    });
    if (!paciente) {
      throw new NotFoundException('Paciente não encontrado nesta clínica.');
    }

    // 2. Valida Profissional (Usuário)
    const profissional = await this.prisma.usuario.findFirst({
      where: { id: dto.usuarioId, clinicaId: clinicaId },
    });
    if (!profissional) {
      // Esta era a linha 84 no seu erro
      throw new NotFoundException('Profissional não encontrado nesta clínica.');
    }
  }

  /**
   * Helper: Verifica se já existe um agendamento conflitante
   */
  private async checarConflito(
    // Esta era a linha 92
    dto: CreateAgendamentoDto,
    clinicaId: number,
  ) {
    const inicio = new Date(dto.data_hora_inicio);
    const fim = new Date(dto.data_hora_fim);

    if (inicio >= fim) {
      throw new BadRequestException(
        'A data de início deve ser anterior à data de fim.',
      );
    }

    const conflito = await this.prisma.agendamento.findFirst({
      where: {
        clinicaId: clinicaId,
        usuarioId: dto.usuarioId,
        status: { not: StatusAgendamento.CANCELADO },
        data_hora_inicio: {
          lt: fim,
        },
        data_hora_fim: {
          gt: inicio,
        },
      },
    });

    if (conflito) {
      throw new ConflictException(
        'Este profissional já possui um agendamento conflitante neste horário.',
      );
    }
  }

  /**
   * CRIAR um novo agendamento
   */
  async create(dto: CreateAgendamentoDto, usuarioLogado: Usuario) {
    // Esta era a linha 131
    const clinicaId = usuarioLogado.clinicaId;

    await this.validarEntidades(dto, clinicaId);
    await this.checarConflito(dto, clinicaId);

    return this.prisma.agendamento.create({
      data: {
        data_hora_inicio: new Date(dto.data_hora_inicio), // <-- Corrigido
        data_hora_fim: new Date(dto.data_hora_fim),       // <-- Corrigido
        notas: dto.notas,
        clinicaId: clinicaId,
        pacienteId: dto.pacienteId,
        usuarioId: dto.usuarioId,
      },
      include: {
        paciente: { select: { nome_completo: true } },
        usuario: { select: { nome_completo: true } },
      },
    });
  } // <-- Provavelmente faltou esta chave '}' no seu código

  /**
   * LISTAR agendamentos (com filtros)
   */
  async findAll(query: QueryAgendamentoDto, usuarioLogado: Usuario) {
    // Esta era a linha 34
    const where: Prisma.AgendamentoWhereInput = {
      clinicaId: usuarioLogado.clinicaId,
      status: { not: StatusAgendamento.CANCELADO },
    };

    if (query.usuarioId) {
      where.usuarioId = query.usuarioId;
    }

    if (query.pacienteId) {
      where.pacienteId = query.pacienteId;
    }

    if (query.data_inicio && query.data_fim) {
      const inicio = new Date(query.data_inicio);
      const fim = new Date(query.data_fim);

      where.data_hora_inicio = {
        lt: fim,
      };
      where.data_hora_fim = {
        gt: inicio,
      };
    }

    return this.prisma.agendamento.findMany({
      where: where,
      include: {
        paciente: { select: { id: true, nome_completo: true } },
        usuario: { select: { id: true, nome_completo: true } },
      },
      orderBy: {
        data_hora_inicio: 'asc',
      },
    });
  }
  private async getAgendamento(id: number, clinicaId: number) {
    const agendamento = await this.prisma.agendamento.findFirst({
      where: {
        id: id,
        clinicaId: clinicaId, // Segurança: Filtra pela clínica
      },
    });

    if (!agendamento) {
      throw new NotFoundException(
        'Agendamento não encontrado ou não pertence a esta clínica.',
      );
    }
    return agendamento;
  }
async findOne(id: number, usuarioLogado: Usuario) {
    // Segurança: Helper já faz a checagem
    return this.getAgendamento(id, usuarioLogado.clinicaId);
  }

  /**
   * ATUALIZAR um agendamento (status, data, etc.)
   */
  async update(
  id: number,
  dto: UpdateAgendamentoDto,
  usuarioLogado: Usuario,
) {
  // 1. Segurança (continua igual)
  await this.getAgendamento(id, usuarioLogado.clinicaId);

  // TODO: Adicionar checagem de conflito se a data (dto.data_hora_inicio) mudar.

  // 2. Converte as datas (se elas foram enviadas no DTO)
  const dataInicio = dto.data_hora_inicio
    ? new Date(dto.data_hora_inicio)
    : undefined;

  const dataFim = dto.data_hora_fim
    ? new Date(dto.data_hora_fim)
    : undefined;

  // 3. Atualiza no banco (A CORREÇÃO ESTÁ AQUI)
  // Removemos o '...dto' e listamos os campos explicitamente.
  return this.prisma.agendamento.update({
    where: { id: id },
    data: {
      // Campos que o DTO pode atualizar
      status: dto.status,
      pacienteId: dto.pacienteId,
      usuarioId: dto.usuarioId,
      notas: dto.notas,

      // Campos que precisam de conversão
      data_hora_inicio: dataInicio,
      data_hora_fim: dataFim,
    },
  });
}

  /**
   * REMOVER um agendamento
   */
  async remove(id: number, usuarioLogado: Usuario) {
    // Segurança: Garante que o usuário está removendo da sua clínica
    await this.getAgendamento(id, usuarioLogado.clinicaId);

    return this.prisma.agendamento.delete({
      where: { id: id },
    });
  }
}