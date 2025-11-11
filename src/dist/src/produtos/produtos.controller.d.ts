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
        unidade_medida: import("@prisma/client").$Enums.UnidadeMedida;
        quantidade_estoque: number;
        estoque_minimo: number;
    }>;
    findAll(req: any): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
        unidade_medida: import("@prisma/client").$Enums.UnidadeMedida;
        quantidade_estoque: number;
        estoque_minimo: number;
    }[]>;
    findOne(id: number, req: any): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
        unidade_medida: import("@prisma/client").$Enums.UnidadeMedida;
        quantidade_estoque: number;
        estoque_minimo: number;
    }>;
    update(id: number, updateDto: UpdateProdutoDto, req: any): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
        unidade_medida: import("@prisma/client").$Enums.UnidadeMedida;
        quantidade_estoque: number;
        estoque_minimo: number;
    }>;
    remove(id: number, req: any): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
        unidade_medida: import("@prisma/client").$Enums.UnidadeMedida;
        quantidade_estoque: number;
        estoque_minimo: number;
    }>;
}
