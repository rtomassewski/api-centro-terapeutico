import { LicencasService } from './licencas.service';
import { UpdateLicencaDto } from './dto/update-licenca.dto';
export declare class LicencasController {
    private readonly licencasService;
    constructor(licencasService: LicencasService);
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
            endereco: string | null;
            logo_url: string | null;
            telefone: string | null;
        };
    } & {
        id: number;
        clinicaId: number;
        plano: import("@prisma/client").$Enums.TipoPlano;
        status: import("@prisma/client").$Enums.StatusLicenca;
        data_expiracao: Date;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, updateLicencaDto: UpdateLicencaDto): import("@prisma/client").Prisma.Prisma__LicencaClient<{
        id: number;
        clinicaId: number;
        plano: import("@prisma/client").$Enums.TipoPlano;
        status: import("@prisma/client").$Enums.StatusLicenca;
        data_expiracao: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
