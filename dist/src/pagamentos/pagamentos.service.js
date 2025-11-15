"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PagamentosService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PagamentosService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma.service");
const client_1 = require("@prisma/client");
const mercadopago_1 = require("mercadopago");
let PagamentosService = PagamentosService_1 = class PagamentosService {
    configService;
    prisma;
    mpClient;
    logger = new common_1.Logger(PagamentosService_1.name);
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        const accessToken = this.configService.get('MERCADO_PAGO_ACCESS_TOKEN');
        if (!accessToken) {
            throw new common_1.InternalServerErrorException('Chave de acesso do Mercado Pago (MERCADO_PAGO_ACCESS_TOKEN) não configurada no .env');
        }
        this.mpClient = new mercadopago_1.MercadoPagoConfig({ accessToken });
    }
    async criarCheckout(usuarioLogado) {
        const licenca = await this.prisma.licenca.findUnique({
            where: { clinicaId: usuarioLogado.clinicaId },
            include: { clinica: true },
        });
        if (!licenca) {
            throw new Error('Licença não encontrada para esta clínica.');
        }
        const valorPlano = 1.00;
        const preferenceData = {
            body: {
                items: [
                    {
                        id: `licenca-${licenca.id}`,
                        title: `Licença SaaS - Plano PRO - ${licenca.clinica.nome_fantasia}`,
                        quantity: 1,
                        unit_price: valorPlano,
                        currency_id: 'BRL',
                    },
                ],
                external_reference: licenca.id.toString(),
                notification_url: 'https://diazotizable-unhandily-arvilla.ngrok-free.dev',
                back_urls: {
                    success: 'https://seu-frontend.com/pagamento-sucesso',
                    failure: 'https://seu-frontend.com/pagamento-falha',
                },
                auto_return: 'approved',
            },
        };
        const preference = new mercadopago_1.Preference(this.mpClient);
        const result = await preference.create(preferenceData);
        return {
            checkoutUrl: result.init_point,
        };
    }
    async processarWebhook(notificacao) {
        this.logger.log('Recebido webhook do Mercado Pago:', notificacao);
        if (notificacao.type === 'payment') {
            const pagamentoId = notificacao.data.id;
            this.logger.log(`Processando Pagamento ID: ${pagamentoId}`);
            try {
                const paymentSdk = new mercadopago_1.Payment(this.mpClient);
                const pagamento = await paymentSdk.get({ id: pagamentoId });
                if (pagamento && pagamento.status === 'approved') {
                    if (pagamento.external_reference) {
                        const licencaId = parseInt(pagamento.external_reference);
                        if (licencaId) {
                            this.logger.log(`Pagamento Aprovado! Atualizando Licença ID: ${licencaId}`);
                            const novaExpiracao = new Date();
                            novaExpiracao.setDate(novaExpiracao.getDate() + 30);
                            await this.prisma.licenca.update({
                                where: { id: licencaId },
                                data: {
                                    status: client_1.StatusLicenca.ATIVA,
                                    data_expiracao: novaExpiracao,
                                },
                            });
                            this.logger.log(`Licença ${licencaId} atualizada para ATIVA.`);
                        }
                        else {
                            this.logger.warn(`Pagamento ${pagamentoId} aprovado, mas 'licencaId' (external_reference) inválido: ${pagamento.external_reference}`);
                        }
                    }
                    else {
                        this.logger.warn(`Pagamento ${pagamentoId} aprovado, mas sem 'external_reference'. Ignorando.`);
                    }
                }
                else {
                    this.logger.warn(`Pagamento ${pagamentoId} não foi aprovado (Status: ${pagamento.status})`);
                }
            }
            catch (error) {
                this.logger.error('Erro ao processar webhook:', error);
            }
        }
        return { status: 'recebido' };
    }
    async superUpdateLicenca(licencaId, dto) {
        const licenca = await this.prisma.licenca.findUnique({
            where: { id: licencaId },
        });
        if (!licenca) {
            throw new common_1.NotFoundException('Licença não encontrada.');
        }
        return this.prisma.licenca.update({
            where: { id: licencaId },
            data: dto,
        });
    }
};
exports.PagamentosService = PagamentosService;
exports.PagamentosService = PagamentosService = PagamentosService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], PagamentosService);
//# sourceMappingURL=pagamentos.service.js.map