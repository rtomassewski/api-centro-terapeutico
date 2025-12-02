import { PrismaService } from '../prisma.service';
export declare class LojaService {
    private prisma;
    constructor(prisma: PrismaService);
    adicionarCredito(pacienteId: number, valor: number, usuarioId: number, clinicaId: number): Promise<{
        message: string;
    }>;
    realizarVenda(pacienteId: number, itens: {
        produtoId: number;
        qtd: number;
    }[], usuarioId: number, clinicaId: number): Promise<{
        id: number;
        clinicaId: number;
        pacienteId: number;
        usuarioId: number;
        valor_total: import("@prisma/client/runtime/library").Decimal;
        data_venda: Date;
    }>;
}
