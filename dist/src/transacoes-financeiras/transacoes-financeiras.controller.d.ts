import { TransacoesFinanceirasService } from './transacoes-financeiras.service';
import { CreateTransacaoFinanceiraDto } from './dto/create-transacao-financeira.dto';
import { UpdateTransacaoFinanceiraDto } from './dto/update-transacao-financeira.dto';
import { QueryTransacaoFinanceiraDto } from './dto/query-transacao-financeira.dto';
export declare class TransacoesFinanceirasController {
    private readonly service;
    constructor(service: TransacoesFinanceirasService);
    create(createDto: CreateTransacaoFinanceiraDto, req: any): Promise<{
        descricao: string;
        id: number;
        clinicaId: number;
        pacienteId: number | null;
        tipo: import("@prisma/client").$Enums.TipoTransacao;
        valor: number;
        data_vencimento: Date;
        categoriaId: number;
        data_pagamento: Date | null;
    }>;
    findAll(query: QueryTransacaoFinanceiraDto, req: any): Promise<({
        paciente: {
            nome_completo: string;
        } | null;
        categoria: {
            nome: string;
        };
    } & {
        descricao: string;
        id: number;
        clinicaId: number;
        pacienteId: number | null;
        tipo: import("@prisma/client").$Enums.TipoTransacao;
        valor: number;
        data_vencimento: Date;
        categoriaId: number;
        data_pagamento: Date | null;
    })[]>;
    findOne(id: number, req: any): Promise<{
        descricao: string;
        id: number;
        clinicaId: number;
        pacienteId: number | null;
        tipo: import("@prisma/client").$Enums.TipoTransacao;
        valor: number;
        data_vencimento: Date;
        categoriaId: number;
        data_pagamento: Date | null;
    }>;
    update(id: number, updateDto: UpdateTransacaoFinanceiraDto, req: any): Promise<{
        descricao: string;
        id: number;
        clinicaId: number;
        pacienteId: number | null;
        tipo: import("@prisma/client").$Enums.TipoTransacao;
        valor: number;
        data_vencimento: Date;
        categoriaId: number;
        data_pagamento: Date | null;
    }>;
    remove(id: number, req: any): Promise<{
        descricao: string;
        id: number;
        clinicaId: number;
        pacienteId: number | null;
        tipo: import("@prisma/client").$Enums.TipoTransacao;
        valor: number;
        data_vencimento: Date;
        categoriaId: number;
        data_pagamento: Date | null;
    }>;
}
