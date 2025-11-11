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
                plano: import("@prisma/client").$Enums.TipoPlano;
                status: import("@prisma/client").$Enums.StatusLicenca;
                data_expiracao: Date;
            } | null;
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            razao_social: string;
            nome_fantasia: string;
            cnpj: string;
            ativa: boolean;
            logo_url: string | null;
            endereco: string | null;
            telefone: string | null;
        };
        id: number;
        nome_completo: string;
        email: string;
        papelId: number;
        registro_conselho: string | null;
        clinicaId: number;
        ativo: boolean;
        assinatura_url: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
