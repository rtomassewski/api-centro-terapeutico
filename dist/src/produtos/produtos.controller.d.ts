import { ProdutosService } from './produtos.service';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
export declare class ProdutosController {
    private readonly produtosService;
    constructor(produtosService: ProdutosService);
    create(createDto: CreateProdutoDto, req: any): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
        ativo: boolean;
        unidade_medida: import("@prisma/client").$Enums.UnidadeMedida;
        estoque: number;
        estoque_minimo: number;
        valor: import("@prisma/client/runtime/library").Decimal;
        tipo: string;
    }>;
    findAll(req: any, tipo?: string): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
        ativo: boolean;
        unidade_medida: import("@prisma/client").$Enums.UnidadeMedida;
        estoque: number;
        estoque_minimo: number;
        valor: import("@prisma/client/runtime/library").Decimal;
        tipo: string;
    }[]>;
    findOne(id: number, req: any): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
        ativo: boolean;
        unidade_medida: import("@prisma/client").$Enums.UnidadeMedida;
        estoque: number;
        estoque_minimo: number;
        valor: import("@prisma/client/runtime/library").Decimal;
        tipo: string;
    }>;
    update(id: number, updateDto: UpdateProdutoDto, req: any): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
        ativo: boolean;
        unidade_medida: import("@prisma/client").$Enums.UnidadeMedida;
        estoque: number;
        estoque_minimo: number;
        valor: import("@prisma/client/runtime/library").Decimal;
        tipo: string;
    }>;
    remove(id: number, req: any): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
        ativo: boolean;
        unidade_medida: import("@prisma/client").$Enums.UnidadeMedida;
        estoque: number;
        estoque_minimo: number;
        valor: import("@prisma/client/runtime/library").Decimal;
        tipo: string;
    }>;
}
