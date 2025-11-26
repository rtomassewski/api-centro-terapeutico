import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';
import { QueryAgendamentoDto } from './dto/query-agendamento.dto';
import { Usuario, StatusAgendamento, Prisma } from '@prisma/client';

@Injectable()
export class AgendamentosService {
  constructor(private prisma: PrismaService) {}

  // --- HELPER: Validar Prestador ---
  private async validarPrestador(usuarioId: number, clinicaId: number) {
    const prestador = await this.prisma.usuario.findFirst({
      where: {
        id: usuarioId,
        clinicaId: clinicaId,
        ativo: true,
      },
      include: { papel: true },
    });

    if (!prestador) {
      throw new BadRequestException('Prestador não encontrado ou inativo.');
    }
    
    // Lista de papéis permitidos para atender (Médico, Dentista, etc.)
    // Ajuste conforme os nomes exatos no seu banco
    const papeisPermitidos = ['MEDICO', 'DENTISTA', 'PSICOLOGO', 'TERAPEUTA', 'ENFERMEIRO'];
    
    if (!papeisPermitidos.includes(prestador.papel.nome)) {
       throw new BadRequestException(`O usuário selecionado (${prestador.papel.nome}) não pode realizar atendimentos.`);
    }
  }

  // --- HELPER: Buscar Um Agendamento (Com Segurança) ---
  async getAgendamento(id: number, clinicaId: number) {
    const agendamento = await this.prisma.agendamento.findFirst({
      where: { id, clinicaId },
      include: {
        procedimentos: { include: { procedimento: true } }
      }
    });

    if (!agendamento) {
      throw new NotFoundException(`Agendamento #${id} não encontrado.`);
    }

    return agendamento;
  }

  // --- CREATE (Com Procedimentos e Valor Total) ---
  async create(dto: CreateAgendamentoDto, usuarioLogado: Usuario) {
    // 1. Valida o prestador
    await this.validarPrestador(dto.usuarioId, usuarioLogado.clinicaId);
    
    const dataInicio = new Date(dto.data_hora_inicio);
    const dataFim = new Date(dataInicio.getTime() + 60 * 60 * 1000); // 1 hora padrão

    // 2. Lógica de Procedimentos e Valor Financeiro
    let valorTotal = 0;
    let createProcedimentosRelation = {}; 

    if (dto.procedimentoIds && dto.procedimentoIds.length > 0) {
      // Busca os procedimentos no banco para pegar o PREÇO REAL
      const procedimentos = await this.prisma.procedimento.findMany({
        where: {
          id: { in: dto.procedimentoIds },
          clinicaId: usuarioLogado.clinicaId,
          ativo: true,
        },
      });

      // Calcula total
      valorTotal = procedimentos.reduce((acc, curr) => acc + curr.valor, 0);

      // Prepara a relação para o Prisma
      createProcedimentosRelation = {
        create: procedimentos.map((proc) => ({
          procedimento: { connect: { id: proc.id } },
          valor_cobrado: proc.valor,
        })),
      };
    }

    // 3. Cria o Agendamento
    return this.prisma.agendamento.create({
      data: {
        pacienteId: dto.pacienteId,
        usuarioId: dto.usuarioId,
        clinicaId: usuarioLogado.clinicaId,
        observacao: dto.observacao,
        data_hora_inicio: dataInicio,
        data_hora_fim: dataFim,
        status: StatusAgendamento.AGENDADO, // Garante o status inicial
        
        // Novos Campos
        valor_total: valorTotal,
        pago: false,
        
        // Vincula os procedimentos
        procedimentos: Object.keys(createProcedimentosRelation).length > 0 
          ? createProcedimentosRelation 
          : undefined, 
      },
      include: {
        procedimentos: { include: { procedimento: true } },
      }
    });
  }

  // --- FIND ALL (Com Procedimentos no Include) ---
  async findAll(query: QueryAgendamentoDto, usuarioLogado: Usuario) {
    const { date, pacienteId, usuarioId } = query;
    const where: Prisma.AgendamentoWhereInput = {
      clinicaId: usuarioLogado.clinicaId,
    };

    if (date) {
      const start = new Date(date);
      start.setUTCHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setUTCHours(23, 59, 59, 999);

      where.data_hora_inicio = {
        gte: start,
        lte: end,
      };
    }

    if (pacienteId) where.pacienteId = +pacienteId;
    if (usuarioId) where.usuarioId = +usuarioId;

    return this.prisma.agendamento.findMany({
      where,
      include: {
        paciente: { select: { nome_completo: true, id: true } },
        usuario: { select: { nome_completo: true } },
        // Inclui os procedimentos na listagem
        procedimentos: {
           include: { procedimento: { select: { nome: true, valor: true } } }
        },
      },
      orderBy: { data_hora_inicio: 'asc' },
    });
  }

  // --- UPDATE (Corrigido para usar StatusAgendamento) ---
  async update(agendamentoId: number, clinicaId: number, updateAgendamentoDto: UpdateAgendamentoDto) {
    // 1. Valida se existe
    await this.getAgendamento(agendamentoId, clinicaId);
    
    const { data_hora_inicio, status, ...rest } = updateAgendamentoDto; 
    
    // Copia campos simples
    const data: any = { ...rest };

    // Lógica de Data
    if (data_hora_inicio) {
        const novaData = new Date(data_hora_inicio);
        data.data_hora_inicio = novaData;
        data.data_hora_fim = new Date(novaData.getTime() + 60 * 60 * 1000); 
    }
    
    // Lógica de Status (Tipagem Segura)
    if (status) {
        data.status = status as StatusAgendamento; 
    }

    // Executa Update
    return this.prisma.agendamento.update({
      where: { id: agendamentoId }, // Correção do erro 500 anterior
      data: data,
      include: { 
        paciente: { select: { nome_completo: true } },
        usuario: { select: { nome_completo: true } },
        procedimentos: { include: { procedimento: true } }
      },
    });
  }

  // --- REMOVE ---
  async remove(id: number, clinicaId: number) {
    await this.getAgendamento(id, clinicaId);
    return this.prisma.agendamento.delete({
      where: { id },
    });
  }
}