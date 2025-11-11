import { EntradasEstoqueService } from './entradas-estoque.service';
import { CreateEntradaEstoqueDto } from './dto/create-entradas-estoque.dto';
import { QueryEntradaEstoqueDto } from './dto/query-entrada-estoque.dto';
export declare class EntradasEstoqueController {
    private readonly entradasEstoqueService;
    constructor(entradasEstoqueService: EntradasEstoqueService);
    create(createDto: CreateEntradaEstoqueDto, req: any): Promise<{
        entrada: {
            id: number;
            clinicaId: number;
            produtoId: number;
            usuarioId: number;
            quantidade: number;
            lote: string | null;
            data_validade: Date | null;
            data_entrada: Date;
        };
        estoque_atual: number;
    }>;
    findAll(req: any, query: QueryEntradaEstoqueDto): Promise<({
        produto: {
            nome: string;
        };
        usuario_registrou: {
            nome_completo: string;
        };
    } & {
        id: number;
        clinicaId: number;
        produtoId: number;
        usuarioId: number;
        quantidade: number;
        lote: string | null;
        data_validade: Date | null;
        data_entrada: Date;
    })[]>;
}
