import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
import { Usuario } from '@prisma/client';
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
}
