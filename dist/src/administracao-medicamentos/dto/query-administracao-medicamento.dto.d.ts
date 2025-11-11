import { StatusAdministracao } from '@prisma/client';
export declare class QueryAdministracaoMedicamentoDto {
    status?: StatusAdministracao;
    pacienteId?: number;
    usuarioAdministrouId?: number;
    data_inicio?: string;
    data_fim?: string;
}
