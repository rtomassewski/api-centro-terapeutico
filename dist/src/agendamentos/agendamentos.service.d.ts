import { PrismaService } from '../prisma.service';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';
import { QueryAgendamentoDto } from './dto/query-agendamento.dto';
import { Usuario } from '@prisma/client';
export declare class AgendamentosService {
    private prisma;
    constructor(prisma: PrismaService);
    private validarPrestador;
    getAgendamento(id: number, clinicaId: number): Promise<{
        procedimentos: ({
            procedimento: {
                nome: string;
                descricao: string | null;
                id: number;
                clinicaId: number;
                ativo: boolean;
                valor: number;
            };
        } & {
            agendamentoId: number;
            procedimentoId: number;
            valor_cobrado: number;
        })[];
    } & {
        id: number;
        clinicaId: number;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.StatusAgendamento;
        pacienteId: number;
        usuarioId: number;
        data_hora_inicio: Date;
        data_hora_fim: Date;
        observacao: string | null;
        valor_total: number | null;
        pago: boolean;
        forma_pagamento: import("@prisma/client").$Enums.FormaPagamento | null;
        transacaoFinanceiraId: number | null;
    }>;
    create(dto: CreateAgendamentoDto, usuarioLogado: Usuario): Promise<{
        procedimentos: ({
            procedimento: {
                nome: string;
                descricao: string | null;
                id: number;
                clinicaId: number;
                ativo: boolean;
                valor: number;
            };
        } & {
            agendamentoId: number;
            procedimentoId: number;
            valor_cobrado: number;
        })[];
    } & {
        id: number;
        clinicaId: number;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.StatusAgendamento;
        pacienteId: number;
        usuarioId: number;
        data_hora_inicio: Date;
        data_hora_fim: Date;
        observacao: string | null;
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
        procedimentos: ({
            procedimento: {
                nome: string;
                valor: number;
            };
        } & {
            agendamentoId: number;
            procedimentoId: number;
            valor_cobrado: number;
        })[];
    } & {
        id: number;
        clinicaId: number;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.StatusAgendamento;
        pacienteId: number;
        usuarioId: number;
        data_hora_inicio: Date;
        data_hora_fim: Date;
        observacao: string | null;
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
        procedimentos: ({
            procedimento: {
                nome: string;
                descricao: string | null;
                id: number;
                clinicaId: number;
                ativo: boolean;
                valor: number;
            };
        } & {
            agendamentoId: number;
            procedimentoId: number;
            valor_cobrado: number;
        })[];
    } & {
        id: number;
        clinicaId: number;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.StatusAgendamento;
        pacienteId: number;
        usuarioId: number;
        data_hora_inicio: Date;
        data_hora_fim: Date;
        observacao: string | null;
        valor_total: number | null;
        pago: boolean;
        forma_pagamento: import("@prisma/client").$Enums.FormaPagamento | null;
        transacaoFinanceiraId: number | null;
    }>;
    remove(id: number, clinicaId: number): Promise<{
        id: number;
        clinicaId: number;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.StatusAgendamento;
        pacienteId: number;
        usuarioId: number;
        data_hora_inicio: Date;
        data_hora_fim: Date;
        observacao: string | null;
        valor_total: number | null;
        pago: boolean;
        forma_pagamento: import("@prisma/client").$Enums.FormaPagamento | null;
        transacaoFinanceiraId: number | null;
    }>;
}
