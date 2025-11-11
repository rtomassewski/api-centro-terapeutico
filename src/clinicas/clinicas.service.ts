// src/clinicas/clinicas.service.ts
import { Injectable, ConflictException, ForbiddenException } from '@nestjs/common';
import { CreateClinicaDto } from './dto/create-clinica.dto';
import { PrismaService } from '../prisma.service';
import { StatusLicenca, TipoPlano } from '@prisma/client';
import { Prisma, Usuario } from '@prisma/client';
import { UpdateClinicaDto } from './dto/update-clinica.dto';

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
  async update(
    id: number, // O ID da clínica vindo da URL
    dto: UpdateClinicaDto,
    usuarioLogado: Usuario, // O usuário logado (Admin)
  ) {
    // 1. REGRA DE SEGURANÇA CRÍTICA:
    // Um Admin (usuarioLogado.clinicaId) SÓ pode editar a SUA PRÓPRIA clínica.
    // O 'id' da URL DEVE ser o mesmo 'clinicaId' do token dele.
    if (id !== usuarioLogado.clinicaId) {
      throw new ForbiddenException(
        'Você não tem permissão para editar esta clínica.',
      );
    }
    
    // 2. REGRA DE NEGÓCIO: Não permitimos mudar o CNPJ
    const { cnpj, ...updateData } = dto as any; // (Ignora o CNPJ se vier)

    // 3. Atualiza
    return this.prisma.clinica.update({
      where: {
        id: id, // Atualiza a clínica (que já validamos ser a do admin)
      },
      data: updateData,
    });
  }
}

