import { PagamentosService } from './pagamentos.service';
import { SuperUpdateLicencaDto } from './dto/super-update-licenca.dto';
export declare class PagamentosController {
    private readonly pagamentosService;
    constructor(pagamentosService: PagamentosService);
    createCheckout(req: any): Promise<{
        checkoutUrl: string | undefined;
    }>;
    receberWebhook(notificacao: any): Promise<{
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
