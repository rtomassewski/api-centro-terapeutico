import { UpdateLicencaDto } from './dto/update-licenca.dto';
import { PrismaService } from '../prisma.service';
export declare class LicencasService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        clinica: {
            id: number;
            nome_fantasia: string;
            cnpj: string;
        };
    } & {
        id: number;
        clinicaId: number;
        plano: import("@prisma/client").$Enums.TipoPlano;
        status: import("@prisma/client").$Enums.StatusLicenca;
        data_expiracao: Date;
    })[]>;
    findOne(id: number): import("@prisma/client").Prisma.Prisma__LicencaClient<({
        clinica: {
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
    } & {
        id: number;
        clinicaId: number;
        plano: import("@prisma/client").$Enums.TipoPlano;
        status: import("@prisma/client").$Enums.StatusLicenca;
        data_expiracao: Date;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, dto: UpdateLicencaDto): import("@prisma/client").Prisma.Prisma__LicencaClient<{
        id: number;
        clinicaId: number;
        plano: import("@prisma/client").$Enums.TipoPlano;
        status: import("@prisma/client").$Enums.StatusLicenca;
        data_expiracao: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
