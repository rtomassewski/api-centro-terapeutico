import { CaixasService } from './caixas.service';
import { AbrirCaixaDto } from './dto/abrir-caixa.dto';
import { FecharCaixaDto } from './dto/fechar-caixa.dto';
export declare class CaixasController {
    private readonly caixasService;
    constructor(caixasService: CaixasService);
    verificarStatus(req: any): Promise<{
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
    abrir(dto: AbrirCaixaDto, req: any): Promise<{
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
    fechar(dto: FecharCaixaDto, req: any): Promise<{
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
