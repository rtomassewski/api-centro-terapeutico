import { CreateCategoriaFinanceiraDto } from './dto/create-categoria-financeira.dto';
import { UpdateCategoriaFinanceiraDto } from './dto/update-categoria-financeira.dto';
import { PrismaService } from '../prisma.service';
import { Usuario } from '@prisma/client';
export declare class CategoriasFinanceirasService {
    private prisma;
    constructor(prisma: PrismaService);
    private getCategoria;
    create(dto: CreateCategoriaFinanceiraDto, usuarioLogado: Usuario): import("@prisma/client").Prisma.Prisma__CategoriaFinanceiraClient<{
        nome: string;
        id: number;
        clinicaId: number;
        tipo: import("@prisma/client").$Enums.TipoTransacao;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(usuarioLogado: Usuario): import("@prisma/client").Prisma.PrismaPromise<{
        nome: string;
        id: number;
        clinicaId: number;
        tipo: import("@prisma/client").$Enums.TipoTransacao;
    }[]>;
    findOne(id: number, usuarioLogado: Usuario): Promise<{
        nome: string;
        id: number;
        clinicaId: number;
        tipo: import("@prisma/client").$Enums.TipoTransacao;
    }>;
    update(id: number, dto: UpdateCategoriaFinanceiraDto, usuarioLogado: Usuario): Promise<{
        nome: string;
        id: number;
        clinicaId: number;
        tipo: import("@prisma/client").$Enums.TipoTransacao;
    }>;
    remove(id: number, usuarioLogado: Usuario): Promise<{
        nome: string;
        id: number;
        clinicaId: number;
        tipo: import("@prisma/client").$Enums.TipoTransacao;
    }>;
}
