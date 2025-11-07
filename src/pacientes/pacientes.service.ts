// src/pacientes/pacientes.service.ts
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { PrismaService } from '../prisma.service';
import { Prisma, StatusLeito } from '@prisma/client'; // Importante para tratar erros
import { Usuario } from '@prisma/client';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { CheckInPacienteDto } from './dto/check-in-paciente.dto';
import { QueryPacienteDto } from './dto/query-paciente.dto';

@Injectable()
export class PacientesService {

  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePacienteDto, usuarioLogado: any) {
    try {
      // Tenta criar o paciente
      const paciente = await this.prisma.paciente.create({
        data: {
          nome_completo: dto.nome_completo,
          nome_social: dto.nome_social,
          data_nascimento: new Date(dto.data_nascimento), // Prisma converte a string ISO
          cpf: dto.cpf,
          nome_responsavel: dto.nome_responsavel,
          telefone_responsavel: dto.telefone_responsavel,
          clinicaId: usuarioLogado.clinicaId,
          // Status e data_admissao são definidos por @default() no schema
        },
      });
      return paciente;

    } catch (error) {
      // Verifica se o erro é de "Violação de constraint Única"
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002' // Código de erro do Prisma para "Unique constraint failed"
      ) {
        // Verifica se a falha foi no campo 'cpf'
        if ((error.meta?.target as string[]).includes('cpf')) {
          throw new ConflictException('Já existe um paciente cadastrado com este CPF.');
        }
      }
      // Se for outro erro, apenas o relança
      throw error;
    }
  }
  async findAll(query: QueryPacienteDto, usuarioLogado: Usuario) {
    const clinicaId = usuarioLogado.clinicaId;

    // 1. Filtro base
    const where: Prisma.PacienteWhereInput = {
      clinicaId: clinicaId,
    };

    if (query.semLeito === 'true') { // <-- Correção: Checa a string "true"
      // Prisma: Encontre pacientes onde a relação 'leito' é nula
      where.leito = null;
    }

    return this.prisma.paciente.findMany({
      where: where,
      select: {
        id: true,
        nome_completo: true,
        nome_social: true,
        data_nascimento: true,
        status: true,
      },
      orderBy: {
        nome_completo: 'asc',
      },
    });
  }
  async findOne(pacienteId: number, usuarioLogado: Usuario) {
    // 1. Busca o paciente pelo ID E pelo clinicaId (o filtro de segurança)
    const paciente = await this.prisma.paciente.findFirst({
      where: {
        id: pacienteId,
        clinicaId: usuarioLogado.clinicaId,
      },
    });

    // 2. Se não encontrar (ou não pertencer à clínica), retorne 404
    if (!paciente) {
      throw new NotFoundException('Paciente não encontrado ou não pertence a esta clínica.');
    }

    // 3. Retorna o paciente com todos os dados
    return paciente;
  }
  async update(
    pacienteId: number,
    dto: UpdatePacienteDto,
    usuarioLogado: Usuario,
  ) {
    // 1. Validar se o paciente pertence à clínica (reutilizando a lógica do findOne)
    // Se não pertencer, o findOne() já lança o erro 404.
    await this.findOne(pacienteId, usuarioLogado);

    try {
      // 2. Tentar atualizar o paciente
      return await this.prisma.paciente.update({
        where: {
          id: pacienteId,
          // (Não precisamos do filtro de clinicaId aqui, 
          // pois o findOne() acima já fez essa checagem)
        },
        data: {
          ...dto, // Passa todos os campos opcionais do DTO
        },
      });
    } catch (error) {
      // 3. Tratar erro de CPF duplicado (caso tentem mudar o CPF)
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        if ((error.meta?.target as string[]).includes('cpf')) {
          throw new ConflictException('Este CPF já está em uso por outro paciente.');
        }
      }
      throw error;
    }
  }

async checkIn(
    pacienteId: number,
    dto: CheckInPacienteDto,
    usuarioLogado: Usuario,
  ) {
    const clinicaId = usuarioLogado.clinicaId;

    // 1. Validar Paciente
    // (Reutiliza o helper que já temos)
    const paciente = await this.findOne(pacienteId, usuarioLogado);

    // 2. Validar Leito (se existe e é da clínica)
    const leito = await this.prisma.leito.findFirst({
      where: { id: dto.leitoId, clinicaId: clinicaId },
    });
    if (!leito) {
      throw new NotFoundException('Leito não encontrado nesta clínica.');
    }

    // 3. REGRA: Paciente já está em um leito?
    // (Procuramos se algum leito já tem esse pacienteId)
    const leitoAtualPaciente = await this.prisma.leito.findFirst({
      where: { pacienteId: pacienteId, clinicaId: clinicaId },
    });
    if (leitoAtualPaciente) {
      throw new ConflictException(
        `Paciente já está alocado no Leito "${leitoAtualPaciente.nome}". Realize o check-out primeiro.`,
      );
    }

    // 4. REGRA: Leito está disponível?
    if (leito.status !== StatusLeito.DISPONIVEL) {
      throw new ConflictException(
        `Este leito não está DISPONÍVEL (Status atual: ${leito.status}).`,
      );
    }

    // 5. AÇÃO: Alocar o paciente
    // (Vincula o paciente ao leito e muda o status do leito)
    return this.prisma.leito.update({
      where: { id: dto.leitoId },
      data: {
        status: StatusLeito.OCUPADO,
        pacienteId: pacienteId, // Vincula o paciente ao leito
      },
      include: {
        quarto: { select: { nome: true } }
      }
    });
  }

async checkOut(pacienteId: number, usuarioLogado: Usuario) {
    const clinicaId = usuarioLogado.clinicaId;

    // 1. Validar Paciente (garante que o ID do paciente é válido e da clínica)
    await this.findOne(pacienteId, usuarioLogado);

    // 2. Encontrar o leito que este paciente está ocupando
    const leitoOcupado = await this.prisma.leito.findFirst({
      where: {
        pacienteId: pacienteId,
        clinicaId: clinicaId,
        status: StatusLeito.OCUPADO,
      },
    });

    // 3. REGRA: Paciente não está internado?
    if (!leitoOcupado) {
      throw new NotFoundException(
        'Paciente não encontrado em nenhum leito ocupado.',
      );
    }

    // 4. AÇÃO: Liberar o leito
    // (Muda o status do leito para DISPONIVEL e remove o pacienteId)
    return this.prisma.leito.update({
      where: {
        id: leitoOcupado.id,
      },
      data: {
        status: StatusLeito.DISPONIVEL,
        pacienteId: null, // Desvincula o paciente
      },
    });
  }
}
