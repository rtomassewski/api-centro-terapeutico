import { CreateTransacaoFinanceiraDto } from './dto/create-transacao-financeira.dto';
import { UpdateTransacaoFinanceiraDto } from './dto/update-transacao-financeira.dto';
import { QueryTransacaoFinanceiraDto } from './dto/query-transacao-financeira.dto';
import { PrismaService } from '../prisma.service';
import { Usuario } from '@prisma/client';
export declare class TransacoesFinanceirasService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(createDto: CreateTransacaoFinanceiraDto, usuario: Usuario): Promise<{
        descricao: string;
        id: number;
        clinicaId: number;
        pacienteId: number | null;
        valor: number;
        tipo: import("@prisma/client").$Enums.TipoTransacao;
        data_vencimento: Date;
        data_pagamento: Date | null;
        categoriaId: number;
    }>;
    findAll(query: QueryTransacaoFinanceiraDto, usuario: Usuario): Promise<({
        paciente: {
            nome_completo: string;
        } | null;
        categoria: {
            nome: string;
            id: number;
            clinicaId: number;
            tipo: import("@prisma/client").$Enums.TipoTransacao;
        };
    } & {
        descricao: string;
        id: number;
        clinicaId: number;
        pacienteId: number | null;
        valor: number;
        tipo: import("@prisma/client").$Enums.TipoTransacao;
        data_vencimento: Date;
        data_pagamento: Date | null;
        categoriaId: number;
    })[]>;
    findOne(id: number, usuario: Usuario): Promise<{
        paciente: {
            id: number;
            nome_completo: string;
            clinicaId: number;
            status: import("@prisma/client").$Enums.StatusPaciente;
            nome_social: string | null;
            data_nascimento: Date;
            cpf: string;
            nome_responsavel: string;
            telefone_responsavel: string;
            data_admissao: Date;
            saldo: import("@prisma/client/runtime/library").Decimal;
        } | null;
        categoria: {
            nome: string;
            id: number;
            clinicaId: number;
            tipo: import("@prisma/client").$Enums.TipoTransacao;
        };
    } & {
        descricao: string;
        id: number;
        clinicaId: number;
        pacienteId: number | null;
        valor: number;
        tipo: import("@prisma/client").$Enums.TipoTransacao;
        data_vencimento: Date;
        data_pagamento: Date | null;
        categoriaId: number;
    }>;
    update(id: number, updateDto: UpdateTransacaoFinanceiraDto, usuario: Usuario): Promise<{
        descricao: string;
        id: number;
        clinicaId: number;
        pacienteId: number | null;
        valor: number;
        tipo: import("@prisma/client").$Enums.TipoTransacao;
        data_vencimento: Date;
        data_pagamento: Date | null;
        categoriaId: number;
    }>;
    remove(id: number, usuario: Usuario): Promise<{
        descricao: string;
        id: number;
        clinicaId: number;
        pacienteId: number | null;
        valor: number;
        tipo: import("@prisma/client").$Enums.TipoTransacao;
        data_vencimento: Date;
        data_pagamento: Date | null;
        categoriaId: number;
    }>;
}
