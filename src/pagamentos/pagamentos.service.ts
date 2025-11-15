// src/pagamentos/pagamentos.service.ts
import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma.service';
import { Usuario } from '@prisma/client';
import { StatusLicenca, TipoPlano } from '@prisma/client';
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago';
import { SuperUpdateLicencaDto } from './dto/super-update-licenca.dto';

@Injectable()
export class PagamentosService {

  private mpClient: MercadoPagoConfig;
  private readonly logger = new Logger(PagamentosService.name);

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    // 2. Inicialize o cliente do Mercado Pago
    // 2. Busque o token
    const accessToken = this.configService.get<string>('MERCADO_PAGO_ACCESS_TOKEN');

    // 3. Verifique se ele existe
    if (!accessToken) {
      throw new InternalServerErrorException(
        'Chave de acesso do Mercado Pago (MERCADO_PAGO_ACCESS_TOKEN) não configurada no .env',
      );
    }

    // 4. Se chegou aqui, accessToken é uma string.
    this.mpClient = new MercadoPagoConfig({ accessToken }); // <-- Agora está correto
  }

  /**
   * Cria uma sessão de checkout no Mercado Pago
   */
  async criarCheckout(usuarioLogado: Usuario) {
    // 1. Encontre a licença do usuário
    const licenca = await this.prisma.licenca.findUnique({
      where: { clinicaId: usuarioLogado.clinicaId },
      include: { clinica: true },
    });

    if (!licenca) {
      throw new Error('Licença não encontrada para esta clínica.');
    }

    // 2. Defina os dados do pagamento (item, preço, etc.)
    // (No futuro, você pegará o 'valor' de um DTO, 
    // mas vamos fixar um valor de R$ 1,00 para teste)
    const valorPlano = 1.00; 

    const preferenceData = {
      body: {
        items: [
          {
            id: `licenca-${licenca.id}`, // ID do seu produto
            title: `Licença SaaS - Plano PRO - ${licenca.clinica.nome_fantasia}`,
            quantity: 1,
            unit_price: valorPlano,
            currency_id: 'BRL', // Moeda (Real Brasileiro)
          },
        ],
        // 3. ID externo para sabermos quem pagou
        external_reference: licenca.id.toString(), 

        // 4. URL de Webhook (o Mercado Pago nos avisará aqui)
        // (ATENÇÃO: Este 'localhost' só funciona com 'ngrok' ou similar)
        notification_url: 'https://diazotizable-unhandily-arvilla.ngrok-free.dev', 

        back_urls: {
          success: 'https://seu-frontend.com/pagamento-sucesso',
          failure: 'https://seu-frontend.com/pagamento-falha',
        },
        auto_return: 'approved',
      },
    };

    // 5. Crie a preferência de pagamento
    const preference = new Preference(this.mpClient);
    const result = await preference.create(preferenceData);

    // 6. Retorne o link de pagamento
    return {
      checkoutUrl: result.init_point, // Link para onde o cliente deve ir
    };
  }
  async processarWebhook(notificacao: any) {
    this.logger.log('Recebido webhook do Mercado Pago:', notificacao);

    // 1. Verificamos se é uma notificação de pagamento
    if (notificacao.type === 'payment') {
      const pagamentoId = notificacao.data.id;
      
      this.logger.log(`Processando Pagamento ID: ${pagamentoId}`);

      try {
        // 2. Buscamos os dados completos do pagamento no Mercado Pago
        const paymentSdk = new Payment(this.mpClient);
        const pagamento = await paymentSdk.get({ id: pagamentoId });

        // 3. Verificamos se o pagamento foi APROVADO
        if (pagamento && pagamento.status === 'approved') {
          
          // 4. Verificamos SE existe uma 'external_reference'
          if (pagamento.external_reference) {
            
            // Se entrou aqui, o TypeScript sabe que é uma 'string'
            const licencaId = parseInt(pagamento.external_reference);

            if (licencaId) {
              this.logger.log(`Pagamento Aprovado! Atualizando Licença ID: ${licencaId}`);
              
              // 5. Calcula a nova data de expiração (ex: +30 dias)
              const novaExpiracao = new Date();
              novaExpiracao.setDate(novaExpiracao.getDate() + 30); // ou +365 se for anual

              // 6. ATUALIZA O BANCO DE DADOS
              await this.prisma.licenca.update({
                where: { id: licencaId },
                data: {
                  status: StatusLicenca.ATIVA,
                  data_expiracao: novaExpiracao,
                },
              });

              this.logger.log(`Licença ${licencaId} atualizada para ATIVA.`);
            } else {
              // Caso o external_reference não seja um número (ex: "abc")
              this.logger.warn(`Pagamento ${pagamentoId} aprovado, mas 'licencaId' (external_reference) inválido: ${pagamento.external_reference}`);
            }

          } else {
            // Caso o pagamento não tenha a referência
            this.logger.warn(`Pagamento ${pagamentoId} aprovado, mas sem 'external_reference'. Ignorando.`);
          }
          
        } else {
          this.logger.warn(`Pagamento ${pagamentoId} não foi aprovado (Status: ${pagamento.status})`);
        }
      } catch (error) {
        this.logger.error('Erro ao processar webhook:', error);
      }
    }
    // Retornamos 200 OK para o Mercado Pago parar de enviar
    return { status: 'recebido' };
  }
  async superUpdateLicenca(
    licencaId: number,
    dto: SuperUpdateLicencaDto,
  ) {
    const licenca = await this.prisma.licenca.findUnique({
      where: { id: licencaId },
    });
    if (!licenca) {
      throw new NotFoundException('Licença não encontrada.');
    }

    // --- CORREÇÃO AQUI ---
    // Mapeia os dados e converte a data
    const dadosParaAtualizar: any = {};
    
    if (dto.plano) {
      dadosParaAtualizar.plano = dto.plano;
    }
    if (dto.status) {
      dadosParaAtualizar.status = dto.status;
    }
    if (dto.data_expiracao) {
      // Converte a string ISO (do JSON) para um objeto Date (do Prisma)
      dadosParaAtualizar.data_expiracao = new Date(dto.data_expiracao);
    }
    // --- FIM DA CORREÇÃO ---

    // Atualiza
    return this.prisma.licenca.update({
      where: { id: licencaId },
      data: dadosParaAtualizar, // Usa os dados mapeados
    });
  }
}