import { PrismaService } from '../prisma.service';
import { AbrirCaixaDto } from './dto/abrir-caixa.dto';
import { FecharCaixaDto } from './dto/fechar-caixa.dto';
export declare class CaixasService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    verificarStatusHoje(usuarioId: number): Promise<{
        id: number;
        clinicaId: number;
        status: import("@prisma/client").$Enums.StatusCaixa;
        usuarioId: number;
        saldo_inicial: number;
        observacoes: string | null;
        saldo_final: number | null;
        data_abertura: Date;
        data_fechamento: Date | null;
    } | null>;
    abrir(usuarioId: number, clinicaId: number, dto: AbrirCaixaDto): Promise<{
        id: number;
        clinicaId: number;
        status: import("@prisma/client").$Enums.StatusCaixa;
        usuarioId: number;
        saldo_inicial: number;
        observacoes: string | null;
        saldo_final: number | null;
        data_abertura: Date;
        data_fechamento: Date | null;
    }>;
    fechar(usuarioId: number, dto: FecharCaixaDto): Promise<{
        id: number;
        clinicaId: number;
        status: import("@prisma/client").$Enums.StatusCaixa;
        usuarioId: number;
        saldo_inicial: number;
        observacoes: string | null;
        saldo_final: number | null;
        data_abertura: Date;
        data_fechamento: Date | null;
    }>;
}
