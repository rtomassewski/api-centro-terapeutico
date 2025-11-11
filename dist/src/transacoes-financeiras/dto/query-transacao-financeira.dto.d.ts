import { TipoTransacao } from '@prisma/client';
export declare class QueryTransacaoFinanceiraDto {
    pacienteId?: number;
    tipo?: TipoTransacao;
    data_inicio?: string;
    data_fim?: string;
}
