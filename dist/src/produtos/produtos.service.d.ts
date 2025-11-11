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
        unidade_medida: import("@prisma/client").$Enums.UnidadeMedida;
        quantidade_estoque: number;
        estoque_minimo: number;
    }>;
    findAll(usuarioLogado: Usuario): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
        unidade_medida: import("@prisma/client").$Enums.UnidadeMedida;
        quantidade_estoque: number;
        estoque_minimo: number;
    }[]>;
    findOne(id: number, usuarioLogado: Usuario): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
        unidade_medida: import("@prisma/client").$Enums.UnidadeMedida;
        quantidade_estoque: number;
        estoque_minimo: number;
    }>;
    update(id: number, dto: UpdateProdutoDto, usuarioLogado: Usuario): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
        unidade_medida: import("@prisma/client").$Enums.UnidadeMedida;
        quantidade_estoque: number;
        estoque_minimo: number;
    }>;
    remove(id: number, usuarioLogado: Usuario): Promise<{
        nome: string;
        descricao: string | null;
        id: number;
        clinicaId: number;
        unidade_medida: import("@prisma/client").$Enums.UnidadeMedida;
        quantidade_estoque: number;
        estoque_minimo: number;
    }>;
}
