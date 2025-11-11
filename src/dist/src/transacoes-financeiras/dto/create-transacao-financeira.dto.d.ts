import { TipoTransacao } from '@prisma/client';
export declare class CreateTransacaoFinanceiraDto {
    descricao: string;
    valor: number;
    tipo: TipoTransacao;
    data_vencimento: string;
    categoriaId: number;
    pacienteId?: number;
}
