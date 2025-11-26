import { AgendamentosService } from './agendamentos.service';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';
import { QueryAgendamentoDto } from './dto/query-agendamento.dto';
export declare class AgendamentosController {
    private readonly agendamentosService;
    constructor(agendamentosService: AgendamentosService);
    create(createDto: CreateAgendamentoDto, req: any): Promise<{
        procedimentos: ({
            procedimento: {
                id: number;
                ativo: boolean;
                clinicaId: number;
                nome: string;
                descricao: string | null;
                valor: number;
            };
        } & {
            agendamentoId: number;
            procedimentoId: number;
            valor_cobrado: number;
        })[];
    } & {
        pacienteId: number;
        usuarioId: number;
        id: number;
        clinicaId: number;
        createdAt: Date;
        updatedAt: Date;
        data_hora_inicio: Date;
        data_hora_fim: Date;
        status: import("@prisma/client").$Enums.StatusAgendamento;
        observacao: string | null;
        valor_total: number | null;
        pago: boolean;
        forma_pagamento: import("@prisma/client").$Enums.FormaPagamento | null;
        transacaoFinanceiraId: number | null;
    }>;
    findAll(query: QueryAgendamentoDto, req: any): Promise<({
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
        pacienteId: number;
        usuarioId: number;
        id: number;
        clinicaId: number;
        createdAt: Date;
        updatedAt: Date;
        data_hora_inicio: Date;
        data_hora_fim: Date;
        status: import("@prisma/client").$Enums.StatusAgendamento;
        observacao: string | null;
        valor_total: number | null;
        pago: boolean;
        forma_pagamento: import("@prisma/client").$Enums.FormaPagamento | null;
        transacaoFinanceiraId: number | null;
    })[]>;
    update(agendamentoId: number, req: any, updateAgendamentoDto: UpdateAgendamentoDto): Promise<{
        usuario: {
            nome_completo: string;
        };
        paciente: {
            nome_completo: string;
        };
        procedimentos: ({
            procedimento: {
                id: number;
                ativo: boolean;
                clinicaId: number;
                nome: string;
                descricao: string | null;
                valor: number;
            };
        } & {
            agendamentoId: number;
            procedimentoId: number;
            valor_cobrado: number;
        })[];
    } & {
        pacienteId: number;
        usuarioId: number;
        id: number;
        clinicaId: number;
        createdAt: Date;
        updatedAt: Date;
        data_hora_inicio: Date;
        data_hora_fim: Date;
        status: import("@prisma/client").$Enums.StatusAgendamento;
        observacao: string | null;
        valor_total: number | null;
        pago: boolean;
        forma_pagamento: import("@prisma/client").$Enums.FormaPagamento | null;
        transacaoFinanceiraId: number | null;
    }>;
}
