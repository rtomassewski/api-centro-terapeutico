import { TipoTransacao } from '@prisma/client';
export declare class CreateTransacaoFinanceiraDto {
    descricao: string;
    valor: number;
    tipo: TipoTransacao;
    categoria_id: number;
    paciente_id?: number;
    data_vencimento: string;
    parcelas?: number;
    repetir?: boolean;
}
