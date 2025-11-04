// src/licencas/licencas.service.ts
import { Injectable } from '@nestjs/common';
import { UpdateLicencaDto } from './dto/update-licenca.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class LicencasService {

  constructor(private prisma: PrismaService) {}

  /**
   * Lista TODAS as licenças de TODOS os clientes
   */
  findAll() {
    return this.prisma.licenca.findMany({
      // Inclui os dados da clínica para saber de quem é a licença
      include: {
        clinica: {
          select: {
            id: true,
            nome_fantasia: true,
            cnpj: true,
          }
        }
      },
      orderBy: {
        data_expiracao: 'asc', // Mostra as que vão expirar primeiro
      }
    });
  }

  /**
   * Busca UMA licença pelo ID
   */
  findOne(id: number) {
    return this.prisma.licenca.findUnique({
      where: { id },
      include: { clinica: true } // Traz todos os dados da clínica
    });
  }

  /**
   * Atualiza uma licença (ex: renovação de pagamento)
   */
  update(id: number, dto: UpdateLicencaDto) {
    return this.prisma.licenca.update({
      where: { id },
      data: {
        plano: dto.plano,
        status: dto.status,
        // Converte a string de data para o formato Date
        data_expiracao: dto.data_expiracao ? new Date(dto.data_expiracao) : undefined,
      },
    });
  }

  // Não precisamos de 'create' (feito pelo ClinicasService)
  // Não precisamos de 'remove' (apenas mudamos o status para 'CANCELADA')
}