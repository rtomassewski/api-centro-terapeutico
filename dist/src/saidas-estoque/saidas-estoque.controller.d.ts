import { SaidasEstoqueService } from './saidas-estoque.service';
import { CreateSaidaEstoqueDto } from './dto/create-saidas-estoque.dto';
import { QuerySaidaEstoqueDto } from './dto/query-saida-estoque.dto';
export declare class SaidasEstoqueController {
    private readonly saidasEstoqueService;
    constructor(saidasEstoqueService: SaidasEstoqueService);
    create(createDto: CreateSaidaEstoqueDto, req: any): Promise<{
        saida: {
            id: number;
            clinicaId: number;
            produtoId: number;
            usuarioId: number;
            quantidade: number;
            data_saida: Date;
            motivo: string | null;
            administracaoId: number | null;
        };
        estoque_atual: number;
    }>;
    findAll(req: any, query: QuerySaidaEstoqueDto): Promise<({
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
        data_saida: Date;
        motivo: string | null;
        administracaoId: number | null;
    })[]>;
}
