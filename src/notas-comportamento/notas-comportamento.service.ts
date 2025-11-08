// src/notas-comportamento/notas-comportamento.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotaComportamentoDto } from './dto/create-nota-comportamento.dto';
import { UpdateNotaComportamentoDto } from './dto/update-notas-comportamento.dto';
import { QueryNotaComportamentoDto } from './dto/query-nota-comportamento.dto';
import { PrismaService } from '../prisma.service';
import { Prisma, Usuario } from '@prisma/client';

@Injectable()
export class NotasComportamentoService {
  constructor(private prisma: PrismaService) {}

  /**
   * Helper: Valida se o paciente existe e pertence à clínica
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
   * Helper: Valida se a nota existe e pertence à clínica
   */
  private async getNota(id: number, clinicaId: number) {
    const nota = await this.prisma.notaComportamento.findFirst({
      where: { id: id, clinicaId: clinicaId },
    });
    if (!nota) {
      throw new NotFoundException('Nota não encontrada.');
    }
    return nota;
  }

  /**
   * CRIAR uma nova Nota de Comportamento
   */
  async create(dto: CreateNotaComportamentoDto, usuarioLogado: Usuario) {
    const clinicaId = usuarioLogado.clinicaId;
    await this.validarPaciente(dto.pacienteId, clinicaId);

    return this.prisma.notaComportamento.create({
      data: {
        nota: dto.nota,
        observacao: dto.observacao,
        clinicaId: clinicaId,
        pacienteId: dto.pacienteId,
        usuarioRegistrouId: usuarioLogado.id, // Auditoria
      },
    });
  }

  /**
   * LISTAR todas as Notas (de um paciente)
   */
  async findAll(query: QueryNotaComportamentoDto, usuarioLogado: Usuario) {
    // 1. Valida se o paciente da query é da clínica (Obrigatório)
    await this.validarPaciente(query.pacienteId, usuarioLogado.clinicaId);

    // 2. Monta o filtro
    const where: Prisma.NotaComportamentoWhereInput = {
      clinicaId: usuarioLogado.clinicaId,
      pacienteId: query.pacienteId,
    };

    return this.prisma.notaComportamento.findMany({
      where: where,
      include: {
        usuario_registrou: { select: { nome_completo: true } },
      },
      orderBy: {
        data_registro: 'desc', // Mais recentes primeiro
      },
    });
  }

  /**
   * BUSCAR UMA nota (raro, mas completo)
   */
  async findOne(id: number, usuarioLogado: Usuario) {
    return this.getNota(id, usuarioLogado.clinicaId);
  }

  /**
   * ATUALIZAR uma nota
   */
  async update(id: number, dto: UpdateNotaComportamentoDto, usuarioLogado: Usuario) {
    await this.getNota(id, usuarioLogado.clinicaId);
    return this.prisma.notaComportamento.update({
      where: { id: id },
      data: dto,
    });
  }

  /**
   * REMOVER uma nota
   */
  async remove(id: number, usuarioLogado: Usuario) {
    await this.getNota(id, usuarioLogado.clinicaId);
    return this.prisma.notaComportamento.delete({
      where: { id: id },
    });
  }
}