import { RelatoriosService } from './relatorios.service';
export declare class RelatoriosController {
    private readonly relatoriosService;
    constructor(relatoriosService: RelatoriosService);
    getDashboard(req: any): Promise<{
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
