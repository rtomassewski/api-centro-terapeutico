import { StatusLicenca, TipoPlano } from '@prisma/client';
export declare class UpdateLicencaDto {
    plano?: TipoPlano;
    status?: StatusLicenca;
    data_expiracao?: string;
}
