import { LojaService } from './loja.service';
export declare class LojaController {
    private readonly lojaService;
    constructor(lojaService: LojaService);
    adicionarCredito(body: {
        pacienteId: number;
        valor: number;
    }, req: any): Promise<{
        id: number;
        nome_completo: string;
        clinicaId: number;
        status: import("@prisma/client").$Enums.StatusPaciente;
        nome_social: string | null;
        data_nascimento: Date;
        cpf: string;
        nome_responsavel: string;
        telefone_responsavel: string;
        data_admissao: Date;
        saldo: import("@prisma/client/runtime/library").Decimal;
    }>;
    realizarVenda(body: {
        pacienteId: number;
        itens: any[];
    }, req: any): Promise<{
        message: string;
        novoSaldo: number;
    }>;
}
