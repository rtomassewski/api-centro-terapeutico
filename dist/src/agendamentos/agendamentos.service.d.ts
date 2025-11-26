import { PrismaService } from '../prisma.service';
import { Usuario } from '@prisma/client';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';
import { QueryAgendamentoDto } from './dto/query-agendamento.dto';
export declare class AgendamentosService {
    private prisma;
    constructor(prisma: PrismaService);
    private getAgendamento;
    private validarPrestador;
    create(dto: CreateAgendamentoDto, usuarioLogado: Usuario): Promise<{
        id: number;
        clinicaId: number;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.StatusAgendamento;
        pacienteId: number;
        usuarioId: number;
        data_hora_inicio: Date;
        observacao: string | null;
        data_hora_fim: Date;
        valor_total: number | null;
        pago: boolean;
        forma_pagamento: import("@prisma/client").$Enums.FormaPagamento | null;
        transacaoFinanceiraId: number | null;
    }>;
    findAll(query: QueryAgendamentoDto, usuarioLogado: Usuario): Promise<({
        usuario: {
            nome_completo: string;
        };
        paciente: {
            id: number;
            nome_completo: string;
        };
    } & {
        id: number;
        clinicaId: number;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.StatusAgendamento;
        pacienteId: number;
        usuarioId: number;
        data_hora_inicio: Date;
        observacao: string | null;
        data_hora_fim: Date;
        valor_total: number | null;
        pago: boolean;
        forma_pagamento: import("@prisma/client").$Enums.FormaPagamento | null;
        transacaoFinanceiraId: number | null;
    })[]>;
    update(agendamentoId: number, clinicaId: number, updateAgendamentoDto: UpdateAgendamentoDto): Promise<{
        usuario: {
            nome_completo: string;
        };
        paciente: {
            nome_completo: string;
        };
    } & {
        id: number;
        clinicaId: number;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.StatusAgendamento;
        pacienteId: number;
        usuarioId: number;
        data_hora_inicio: Date;
        observacao: string | null;
        data_hora_fim: Date;
        valor_total: number | null;
        pago: boolean;
        forma_pagamento: import("@prisma/client").$Enums.FormaPagamento | null;
        transacaoFinanceiraId: number | null;
    }>;
}
