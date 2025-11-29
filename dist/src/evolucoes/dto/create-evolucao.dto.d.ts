import { TipoEvolucao } from '@prisma/client';
export declare class CreateEvolucaoDto {
    descricao: string;
    pacienteId: number;
    tipo?: TipoEvolucao;
    agendamentoId?: number;
}
