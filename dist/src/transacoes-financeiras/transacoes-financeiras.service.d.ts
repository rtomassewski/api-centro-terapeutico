import { CreateTransacaoFinanceiraDto } from './dto/create-transacao-financeira.dto';
import { UpdateTransacaoFinanceiraDto } from './dto/update-transacao-financeira.dto';
import { PrismaService } from '../prisma.service';
import { Usuario } from '@prisma/client';
import { QueryTransacaoFinanceiraDto } from './dto/query-transacao-financeira.dto';
export declare class TransacoesFinanceirasService {
    private prisma;
    constructor(prisma: PrismaService);
    private getTransacao;
    create(dto: CreateTransacaoFinanceiraDto, usuarioLogado: Usuario): Promise<{
        descricao: string;
        id: number;
        clinicaId: number;
        pacienteId: number | null;
        valor: number;
        tipo: import("@prisma/client").$Enums.TipoTransacao;
        data_vencimento: Date;
        categoriaId: number;
        data_pagamento: Date | null;
    }>;
    findAll(query: QueryTransacaoFinanceiraDto, usuarioLogado: Usuario): Promise<({
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
        valor: number;
        tipo: import("@prisma/client").$Enums.TipoTransacao;
        data_vencimento: Date;
        categoriaId: number;
        data_pagamento: Date | null;
    })[]>;
    findOne(id: number, usuarioLogado: Usuario): Promise<{
        descricao: string;
        id: number;
        clinicaId: number;
        pacienteId: number | null;
        valor: number;
        tipo: import("@prisma/client").$Enums.TipoTransacao;
        data_vencimento: Date;
        categoriaId: number;
        data_pagamento: Date | null;
    }>;
    update(id: number, dto: UpdateTransacaoFinanceiraDto, usuarioLogado: Usuario): Promise<{
        descricao: string;
        id: number;
        clinicaId: number;
        pacienteId: number | null;
        valor: number;
        tipo: import("@prisma/client").$Enums.TipoTransacao;
        data_vencimento: Date;
        categoriaId: number;
        data_pagamento: Date | null;
    }>;
    remove(id: number, usuarioLogado: Usuario): Promise<{
        descricao: string;
        id: number;
        clinicaId: number;
        pacienteId: number | null;
        valor: number;
        tipo: import("@prisma/client").$Enums.TipoTransacao;
        data_vencimento: Date;
        categoriaId: number;
        data_pagamento: Date | null;
    }>;
}
