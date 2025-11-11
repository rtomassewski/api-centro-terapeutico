import { UnidadeMedida } from '@prisma/client';
export declare class CreateProdutoDto {
    nome: string;
    descricao?: string;
    unidade_medida: UnidadeMedida;
    estoque_minimo?: number;
}
