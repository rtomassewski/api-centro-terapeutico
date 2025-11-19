import { Strategy } from 'passport-jwt';
import { PrismaService } from '../prisma.service';
import { StatusLicenca } from '@prisma/client';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private prisma;
    constructor(prisma: PrismaService);
    validate(payload: {
        sub: number;
        email: string;
        papelId: number;
        clinicaId: number;
        licencaStatus: StatusLicenca;
    }): Promise<{
        papel: {
            nome: import("@prisma/client").$Enums.NomePapel;
        };
        clinica: {
            licenca: {
                id: number;
                clinicaId: number;
                status: import("@prisma/client").$Enums.StatusLicenca;
                plano: import("@prisma/client").$Enums.TipoPlano;
                data_expiracao: Date;
            } | null;
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            ativa: boolean;
            cnpj: string;
            razao_social: string;
            nome_fantasia: string;
            endereco: string | null;
            logo_url: string | null;
            telefone: string | null;
        };
        id: number;
        nome_completo: string;
        email: string;
        registro_conselho: string | null;
        ativo: boolean;
        papelId: number;
        clinicaId: number;
        createdAt: Date;
        updatedAt: Date;
        assinatura_url: string | null;
    }>;
}
export {};
