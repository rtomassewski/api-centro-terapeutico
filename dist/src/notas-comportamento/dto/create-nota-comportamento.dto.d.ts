import { RatingComportamento } from '@prisma/client';
export declare class CreateNotaComportamentoDto {
    pacienteId: number;
    nota: RatingComportamento;
    observacao?: string;
}
