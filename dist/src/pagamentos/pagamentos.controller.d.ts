import { PagamentosService } from './pagamentos.service';
export declare class PagamentosController {
    private readonly pagamentosService;
    constructor(pagamentosService: PagamentosService);
    createCheckout(req: any): Promise<{
        checkoutUrl: string | undefined;
    }>;
    receberWebhook(notificacao: any): Promise<{
        status: string;
    }>;
}
