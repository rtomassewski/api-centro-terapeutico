// src/agendamentos/agendamentos.service.ts
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Usuario, StatusAgendamento } from '@prisma/client'; 
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';
import { QueryAgendamentoDto } from './dto/query-agendamento.dto';

@Injectable()
export class AgendamentosService {
  constructor(private prisma: PrismaService) {}

  // --- Helpers de Segurança ---
  private async getAgendamento(agendamentoId: number, clinicaId: number) {
    const agendamento = await this.prisma.agendamento.findFirst({
      where: { id: agendamentoId, clinicaId },
    });
    if (!agendamento) {
      throw new NotFoundException('Agendamento não encontrado.');
    }
    return agendamento;
  }
  
  private async validarPrestador(prestadorId: number, clinicaId: number): Promise<void> {
    const prestador = await this.prisma.usuario.findFirst({
      where: { id: prestadorId, clinicaId: clinicaId, ativo: true },
    });
    if (!prestador) {
      throw new NotFoundException('Prestador não encontrado ou inativo.');
    }
  }

  // --- MÉTODOS DE CRIAÇÃO/BUSCA ---

  async create(dto: CreateAgendamentoDto, usuarioLogado: Usuario) {
    await this.validarPrestador(dto.usuarioId, usuarioLogado.clinicaId);
    
    // 1. Converte a data de início
    const dataInicio = new Date(dto.data_hora_inicio);
    
    // 2. CORREÇÃO: CALCULA A DATA DE FIM (Adiciona 1 hora)
    const dataFim = new Date(dataInicio.getTime() + 60 * 60 * 1000); // Adiciona 60 minutos

    // 3. Tenta criar o agendamento
    return this.prisma.agendamento.create({
      data: {
        pacienteId: dto.pacienteId,
        usuarioId: dto.usuarioId,
        clinicaId: usuarioLogado.clinicaId,
        observacao: dto.observacao, 
        data_hora_inicio: dataInicio,
        data_hora_fim: dataFim, // <-- A LINHA QUE FALTAVA (Agora calculada)
        // status: AGUARDANDO (default do schema)
      },
    });
  }

  async findAll(query: QueryAgendamentoDto, usuarioLogado: Usuario) {
    const where: Prisma.AgendamentoWhereInput = {
      clinicaId: usuarioLogado.clinicaId,
    };
    
    // O DTO de Query usa 'date'. Onde usa, deve ser corrigido para data_hora_inicio.
    if (query.date) { 
        const dayStart = new Date(query.date);
        const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000); 
        where.data_hora_inicio = { gte: dayStart, lt: dayEnd }; // <-- CORRIGIDO
    }

    return this.prisma.agendamento.findMany({
      where: where,
      include: {
        paciente: { select: { nome_completo: true, id: true } }, // <-- CORRIGIDO nomeCompleto
        usuario: { select: { nome_completo: true } },
      },
      orderBy: { data_hora_inicio: 'asc' }, // <-- CORRIGIDO data_hora
    });
  }

  // --- MÉTODO UPDATE CORRIGIDO (resolve todos os erros restantes) ---

  async update(agendamentoId: number, clinicaId: number, updateAgendamentoDto: UpdateAgendamentoDto) {
    
    // 1. Valida se o agendamento existe e pertence à clínica (Segurança)
    await this.getAgendamento(agendamentoId, clinicaId);
    
    // 2. Separa os dados
    const { data_hora_inicio, status, ...rest } = updateAgendamentoDto; 
    
    // Copia observação e outros campos simples
    const data: any = { ...rest };

    // 3. Lógica de Data (Se for alterada)
    if (data_hora_inicio) {
        const novaData = new Date(data_hora_inicio);
        data.data_hora_inicio = novaData;
        // Recalcula o fim (1 hora depois)
        data.data_hora_fim = new Date(novaData.getTime() + 60 * 60 * 1000); 
    }
    
    // 4. Lógica de Status
    if (status) {
        data.status = status as StatusAgendamento;
    }

    // 5. Executa a atualização
    return this.prisma.agendamento.update({
      // CORREÇÃO PRINCIPAL: O 'where' só pode ter o ID
      where: { id: agendamentoId }, 
      data: data,
      include: { 
        paciente: { select: { nome_completo: true } },
        usuario: { select: { nome_completo: true } } 
      },
    });
  }
}