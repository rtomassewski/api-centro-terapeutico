import { PrismaService } from '../prisma.service';
import { Usuario } from '@prisma/client';
export declare class RelatoriosService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboard(usuarioLogado: Usuario): Promise<{
        pacientes: {
            ativos: number;
            admissoesNoMes: number;
        };
        leitos: {
            ocupados: number;
            disponiveis: number;
            total: number;
            taxaOcupacao: number;
        };
        financeiro: {
            receitaMes: number;
            despesaMes: number;
            saldoMes: number;
        };
        dataAtualizacao: string;
    }>;
}
