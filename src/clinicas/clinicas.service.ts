// src/clinicas/clinicas.service.ts
import { Injectable, ConflictException } from '@nestjs/common';
import { CreateClinicaDto } from './dto/create-clinica.dto';
import { PrismaService } from '../prisma.service';
import { StatusLicenca, TipoPlano } from '@prisma/client';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClinicasService {
  
  constructor(private prisma: PrismaService) {}

  /**
   * Cria uma nova Clínica e sua Licença inicial (Teste de 30 dias)
   */
  async create(dto: CreateClinicaDto) {
    // Calcula a data de expiração para o teste (30 dias a partir de hoje)
    const dataExpiracao = new Date();
    dataExpiracao.setDate(dataExpiracao.getDate() + 30);

    try {
      // Usamos uma $transaction para garantir que ambas as operações
      // (criar clínica E criar licença) funcionem, ou ambas falhem.
      const clinica = await this.prisma.$transaction(async (tx) => {
        // 1. Cria a Clínica
        const novaClinica = await tx.clinica.create({
          data: {
            razao_social: dto.razao_social,
            nome_fantasia: dto.nome_fantasia,
            cnpj: dto.cnpj,
            ativa: true,
          },
        });

        // 2. Cria a Licença de TESTE
        await tx.licenca.create({
          data: {
            plano: TipoPlano.TESTE, // (Vamos ter que adicionar TESTE ao Enum)
            status: StatusLicenca.TESTE,
            data_expiracao: dataExpiracao,
            clinicaId: novaClinica.id, // Vincula à clínica
          },
        });

        return novaClinica;
      });

      return clinica;

    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002' // Erro de constraint única
      ) {
        if ((error.meta?.target as string[]).includes('cnpj')) {
          throw new ConflictException('Já existe uma clínica com este CNPJ.');
        }
      }
      throw error;
    }
  }
}
