import { CreateProdutoDto } from './dto/create-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { PrismaService } from '../prisma.service';
import { Usuario } from '@prisma/client';
export declare class ProdutosService {
    private prisma;
    constructor(prisma: PrismaService);
    private getProduto;
    create(dto: CreateProdutoDto, usuarioLogado: Usuario): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
        ativo: boolean;
        unidade_medida: import("@prisma/client").$Enums.UnidadeMedida;
        estoque: number;
        estoque_minimo: number;
        valor: import("@prisma/client/runtime/library").Decimal;
    }>;
    findAll(usuarioLogado: Usuario): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
        ativo: boolean;
        unidade_medida: import("@prisma/client").$Enums.UnidadeMedida;
        estoque: number;
        estoque_minimo: number;
        valor: import("@prisma/client/runtime/library").Decimal;
    }[]>;
    findOne(id: number, usuarioLogado: Usuario): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
        ativo: boolean;
        unidade_medida: import("@prisma/client").$Enums.UnidadeMedida;
        estoque: number;
        estoque_minimo: number;
        valor: import("@prisma/client/runtime/library").Decimal;
    }>;
    update(id: number, dto: UpdateProdutoDto, usuarioLogado: Usuario): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
        ativo: boolean;
        unidade_medida: import("@prisma/client").$Enums.UnidadeMedida;
        estoque: number;
        estoque_minimo: number;
        valor: import("@prisma/client/runtime/library").Decimal;
    }>;
    remove(id: number, usuarioLogado: Usuario): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
        ativo: boolean;
        unidade_medida: import("@prisma/client").$Enums.UnidadeMedida;
        estoque: number;
        estoque_minimo: number;
        valor: import("@prisma/client/runtime/library").Decimal;
    }>;
}
