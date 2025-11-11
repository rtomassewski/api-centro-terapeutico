import { CreateSaidaEstoqueDto } from './dto/create-saidas-estoque.dto';
import { QuerySaidaEstoqueDto } from './dto/query-saida-estoque.dto';
import { PrismaService } from '../prisma.service';
import { Usuario } from '@prisma/client';
export declare class SaidasEstoqueService {
    private prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateSaidaEstoqueDto, usuarioLogado: Usuario): Promise<{
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
    findAll(query: QuerySaidaEstoqueDto, usuarioLogado: Usuario): Promise<({
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
    findOne(id: number): void;
    update(id: number): void;
    remove(id: number): void;
}
