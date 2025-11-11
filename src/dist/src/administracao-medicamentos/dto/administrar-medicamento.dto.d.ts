import { StatusAdministracao } from '@prisma/client';
export declare class AdministrarMedicamentoDto {
    status: StatusAdministracao;
    quantidade_administrada?: number;
    notas?: string;
}
