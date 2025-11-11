import { CreateEntradaEstoqueDto } from './dto/create-entradas-estoque.dto';
import { QueryEntradaEstoqueDto } from './dto/query-entrada-estoque.dto';
import { PrismaService } from '../prisma.service';
import { Usuario } from '@prisma/client';
export declare class EntradasEstoqueService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateEntradaEstoqueDto, usuarioLogado: Usuario): Promise<{
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
    findAll(query: QueryEntradaEstoqueDto, usuarioLogado: Usuario): Promise<({
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
    findOne(id: number): void;
    update(id: number): void;
    remove(id: number): void;
}
