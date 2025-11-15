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
        status: import("@prisma/client").$Enums.StatusLicenca;
        plano: import("@prisma/client").$Enums.TipoPlano;
        data_expiracao: Date;
    })[]>;
    findOne(id: number): import("@prisma/client").Prisma.Prisma__LicencaClient<({
        clinica: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            ativa: boolean;
            nome_fantasia: string;
            cnpj: string;
            razao_social: string;
            logo_url: string | null;
            endereco: string | null;
            telefone: string | null;
        };
    } & {
        id: number;
        clinicaId: number;
        status: import("@prisma/client").$Enums.StatusLicenca;
        plano: import("@prisma/client").$Enums.TipoPlano;
        data_expiracao: Date;
    }) | null, null, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: number, updateLicencaDto: UpdateLicencaDto): import("@prisma/client").Prisma.Prisma__LicencaClient<{
        id: number;
        clinicaId: number;
        status: import("@prisma/client").$Enums.StatusLicenca;
        plano: import("@prisma/client").$Enums.TipoPlano;
        data_expiracao: Date;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
