import { CategoriasFinanceirasService } from './categorias-financeiras.service';
import { CreateCategoriaFinanceiraDto } from './dto/create-categoria-financeira.dto';
import { UpdateCategoriaFinanceiraDto } from './dto/update-categoria-financeira.dto';
export declare class CategoriasFinanceirasController {
    private readonly service;
    constructor(service: CategoriasFinanceirasService);
    create(dto: CreateCategoriaFinanceiraDto, req: any): import("@prisma/client").Prisma.Prisma__CategoriaFinanceiraClient<{
        nome: string;
        id: number;
        clinicaId: number;
        tipo: import("@prisma/client").$Enums.TipoTransacao;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    findAll(req: any): import("@prisma/client").Prisma.PrismaPromise<{
        nome: string;
        id: number;
        clinicaId: number;
        tipo: import("@prisma/client").$Enums.TipoTransacao;
    }[]>;
    findOne(id: number, req: any): Promise<{
        nome: string;
        id: number;
        clinicaId: number;
        tipo: import("@prisma/client").$Enums.TipoTransacao;
    }>;
    update(id: number, dto: UpdateCategoriaFinanceiraDto, req: any): Promise<{
        nome: string;
        id: number;
        clinicaId: number;
        tipo: import("@prisma/client").$Enums.TipoTransacao;
    }>;
    remove(id: number, req: any): Promise<{
        nome: string;
        id: number;
        clinicaId: number;
        tipo: import("@prisma/client").$Enums.TipoTransacao;
    }>;
}
