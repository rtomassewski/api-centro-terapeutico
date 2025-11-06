// src/sinais-vitais/sinais-vitais.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSinalVitalDto } from './dto/create-sinal-vital.dto';
import { UpdateSinalVitalDto } from './dto/update-sinal-vital.dto';
import { QuerySinalVitalDto } from './dto/query-sinal-vital.dto';
import { PrismaService } from '../prisma.service';
import { Prisma, Usuario } from '@prisma/client';

@Injectable()
export class SinaisVitaisService {
  
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
   * Helper: Valida se o sinal vital existe e pertence à clínica
   */
  private async getSinalVital(id: number, clinicaId: number) {
    const sinalVital = await this.prisma.sinalVital.findFirst({
      where: { id: id, clinicaId: clinicaId },
    });
    if (!sinalVital) {
      throw new NotFoundException('Registro de Sinal Vital não encontrado.');
    }
    return sinalVital;
  }

  /**
   * CRIAR um novo registro de Sinais Vitais
   */
  async create(dto: CreateSinalVitalDto, usuarioLogado: Usuario) {
    const clinicaId = usuarioLogado.clinicaId;

    // 1. Valida se o paciente é da clínica
    await this.validarPaciente(dto.pacienteId, clinicaId);

    // 2. Cria o registro
    return this.prisma.sinalVital.create({
      data: {
        clinicaId: clinicaId,
        pacienteId: dto.pacienteId,
        usuarioAferiuId: usuarioLogado.id, // Auditoria
        data_hora_afericao: dto.data_hora_afericao
          ? new Date(dto.data_hora_afericao)
          : new Date(),
        // Dados
        pressao_arterial: dto.pressao_arterial,
        frequencia_cardiaca: dto.frequencia_cardiaca,
        frequencia_respiratoria: dto.frequencia_respiratoria,
        temperatura: dto.temperatura,
        saturacao_oxigenio: dto.saturacao_oxigenio,
        glicemia: dto.glicemia,
        dor: dto.dor,
        notas: dto.notas,
      },
    });
  }

  /**
   * LISTAR todos os Sinais Vitais (de um paciente)
   */
  async findAll(query: QuerySinalVitalDto, usuarioLogado: Usuario) {
    // 1. Valida se o paciente da query é da clínica (Obrigatório)
    await this.validarPaciente(query.pacienteId, usuarioLogado.clinicaId);

    // 2. Monta o filtro
    const where: Prisma.SinalVitalWhereInput = {
      clinicaId: usuarioLogado.clinicaId,
      pacienteId: query.pacienteId,
    };

    // 3. Filtro de período (Opcional)
    if (query.data_inicio && query.data_fim) {
      where.data_hora_afericao = {
        gte: new Date(query.data_inicio),
        lte: new Date(query.data_fim),
      };
    }

    return this.prisma.sinalVital.findMany({
      where: where,
      include: {
        usuario_aferiu: { select: { nome_completo: true } },
      },
      orderBy: {
        data_hora_afericao: 'desc', // Mais recentes primeiro
      },
    });
  }

  /**
   * BUSCAR UM registro
   */
  async findOne(id: number, usuarioLogado: Usuario) {
    // 1. Valida se o registro é da clínica
    const sinalVital = await this.getSinalVital(id, usuarioLogado.clinicaId);
    
    // 2. Busca o registro completo
    return this.prisma.sinalVital.findUnique({
      where: { id: sinalVital.id },
      include: {
        paciente: { select: { nome_completo: true } },
        usuario_aferiu: { select: { nome_completo: true } },
      }
    });
  }

  /**
   * ATUALIZAR um registro
   */
  async update(id: number, dto: UpdateSinalVitalDto, usuarioLogado: Usuario) {
    // 1. Valida se o registro é da clínica
    await this.getSinalVital(id, usuarioLogado.clinicaId);

    // 2. Atualiza
    return this.prisma.sinalVital.update({
      where: { id: id },
      data: {
        ...dto,
        // Converte a data se ela for enviada
        data_hora_afericao: dto.data_hora_afericao 
          ? new Date(dto.data_hora_afericao) 
          : undefined,
      },
    });
  }

  /**
   * REMOVER um registro
   */
  async remove(id: number, usuarioLogado: Usuario) {
    // 1. Valida se o registro é da clínica
    await this.getSinalVital(id, usuarioLogado.clinicaId);
    
    // 2. Remove
    return this.prisma.sinalVital.delete({
      where: { id: id },
    });
  }
}