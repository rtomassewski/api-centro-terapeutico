import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
import { Usuario } from '@prisma/client';
import { SuperUpdateLicencaDto } from './dto/super-update-licenca.dto';
export declare class PagamentosService {
    private configService;
    private prisma;
    private mpClient;
    private readonly logger;
    constructor(configService: ConfigService, prisma: PrismaService);
    criarCheckout(usuarioLogado: Usuario): Promise<{
        checkoutUrl: string | undefined;
    }>;
    processarWebhook(notificacao: any): Promise<{
        status: string;
    }>;
    superUpdateLicenca(licencaId: number, dto: SuperUpdateLicencaDto): Promise<{
        id: number;
        clinicaId: number;
        status: import("@prisma/client").$Enums.StatusLicenca;
        plano: import("@prisma/client").$Enums.TipoPlano;
        data_expiracao: Date;
    }>;
}
