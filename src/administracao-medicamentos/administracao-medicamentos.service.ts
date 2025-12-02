// src/administracao-medicamentos/administracao-medicamentos.service.ts
import { Injectable, NotFoundException, ConflictException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { CreateAdministracaoMedicamentoDto } from './dto/create-administracao-medicamento.dto';
import { UpdateAdministracaoMedicamentoDto } from './dto/update-administracao-medicamento.dto';
import { PrismaService } from '../prisma.service';
import { StatusAdministracao, Usuario, Prisma } from '@prisma/client';
import { AdministrarMedicamentoDto } from './dto/administrar-medicamento.dto';
import { QueryAdministracaoMedicamentoDto } from './dto/query-administracao-medicamento.dto';

@Injectable()
export class AdministracaoMedicamentosService {
  
  constructor(private prisma: PrismaService) {}

  /**
   * Helper: Valida se o paciente e a prescrição existem e são da mesma clínica
   */
  private async getAdministracao(id: number, clinicaId: number) {
    const administracao = await this.prisma.administracaoMedicamento.findFirst({
      where: { id: id, clinicaId: clinicaId },
    });

    if (!administracao) {
      throw new NotFoundException(
        'Registro de administração não encontrado ou não pertence a esta clínica.',
      );
    }
    return administracao;
  }
  
  private async validarEntidades(
    dto: CreateAdministracaoMedicamentoDto,
    clinicaId: number,
  ) {
    // 1. Valida Paciente
    const paciente = await this.prisma.paciente.findFirst({
      where: { id: dto.pacienteId, clinicaId: clinicaId },
    });
    if (!paciente) {
      throw new NotFoundException('Paciente não encontrado nesta clínica.');
    }

    // 2. Valida Prescrição
    const prescricao = await this.prisma.prescricao.findFirst({
      where: { id: dto.prescricaoId, pacienteId: dto.pacienteId },
    });
    if (!prescricao) {
      throw new NotFoundException(
        'Prescrição não encontrada ou não pertence a este paciente.',
      );
    }
  }

  /**
   * CRIAR um novo aprazamento (agendamento de medicação)
   */
  async create(dto: CreateAdministracaoMedicamentoDto, usuarioLogado: Usuario) {
    const clinicaId = usuarioLogado.clinicaId;

    // 1. Valida se o paciente e a prescrição são válidos
    await this.validarEntidades(dto, clinicaId);

    // 2. Cria o registro PENDENTE
    return this.prisma.administracaoMedicamento.create({
      data: {
        data_hora_prevista: new Date(dto.data_hora_prevista), 
        notas: dto.notas,
        status: StatusAdministracao.PENDENTE,
        clinicaId: clinicaId, 
        pacienteId: dto.pacienteId,
        prescricaoId: dto.prescricaoId,
      },
    });
  }

  async administrar(
    id: number,
    dto: AdministrarMedicamentoDto,
    usuarioLogado: Usuario,
  ) {
    // 1. Validação de Segurança
    const administracao = await this.getAdministracao(
      id,
      usuarioLogado.clinicaId,
    );
    if (administracao.status !== StatusAdministracao.PENDENTE) {
      throw new ConflictException(
        `Esta medicação já foi processada (Status: ${administracao.status}).`,
      );
    }

    // 2. Se o status for 'ADMINISTRADO', a quantidade é obrigatória
    if (
      dto.status === StatusAdministracao.ADMINISTRADO &&
      (!dto.quantidade_administrada || dto.quantidade_administrada <= 0)
    ) {
      throw new BadRequestException(
        'A "quantidade_administrada" é obrigatória e deve ser positiva.',
      );
    }

    // 3. Busca a Prescrição e o Produto associado
    const prescricao = await this.prisma.prescricao.findUnique({
      where: { id: administracao.prescricaoId },
      include: { produto: true },
    });
    if (!prescricao || !prescricao.produto) {
      throw new NotFoundException('Produto ou prescrição não encontrado.');
    }
    const produto = prescricao.produto;
    const quantidade_para_sair = dto.quantidade_administrada || 0;

    // 4. Se for 'ADMINISTRADO', verifica o estoque
    if (dto.status === StatusAdministracao.ADMINISTRADO) {
      // --- CORREÇÃO AQUI: Mudado de quantidade_estoque para estoque ---
      if (produto.estoque < quantidade_para_sair) {
        throw new ConflictException(
          `Estoque insuficiente para "${produto.nome}". Estoque atual: ${produto.estoque}`,
        );
      }
    }

    // 5. A TRANSAÇÃO: 3 operações em 1
    try {
      const [saida, adm, produtoAtualizado] = await this.prisma.$transaction(async (tx) => {

        // 5a. Atualiza a Administração (Enfermagem)
        const admAtualizada = await tx.administracaoMedicamento.update({
          where: { id: id },
          data: {
            status: dto.status,
            notas: dto.notas,
            data_hora_administracao: new Date(),
            usuarioAdministrouId: usuarioLogado.id,
          },
        });

        // Se não foi administrado (RECUSADO/NAO_ADMINISTRADO), pare aqui.
        if (dto.status !== StatusAdministracao.ADMINISTRADO) {
          return [null, admAtualizada, null]; 
        }

        // 5b. Cria a Saída de Estoque
        const novaSaida = await tx.saidaEstoque.create({
          data: {
            quantidade: quantidade_para_sair,
            motivo: `Administração Paciente ID ${administracao.pacienteId}`,
            clinicaId: usuarioLogado.clinicaId,
            produtoId: produto.id,
            usuarioId: usuarioLogado.id,
            administracaoId: id, 
          },
        });

        // 5c. Decrementa o Estoque do Produto
        // --- CORREÇÃO AQUI: Mudado de quantidade_estoque para estoque ---
        const produtoNovo = await tx.produto.update({
          where: { id: produto.id },
          data: {
            estoque: { 
              decrement: quantidade_para_sair,
            },
          },
        });

        return [novaSaida, admAtualizada, produtoNovo];
      });

      return {
        administracao: adm,
        saida_estoque: saida,
        // --- CORREÇÃO AQUI: Mudado de quantidade_estoque para estoque ---
        estoque_atual: produtoAtualizado?.estoque,
      };

    } catch (error) {
      throw new ConflictException(`Falha na transação de estoque: ${error.message}`);
    }
  }

  async findAll(
    query: QueryAdministracaoMedicamentoDto,
    usuarioLogado: Usuario,
  ) {
    const where: Prisma.AdministracaoMedicamentoWhereInput = {
      clinicaId: usuarioLogado.clinicaId,
    };

    if (query.status) where.status = query.status;
    if (query.pacienteId) where.pacienteId = query.pacienteId;
    if (query.usuarioAdministrouId) where.usuarioAdministrouId = query.usuarioAdministrouId;

    if (query.data_inicio && query.data_fim) {
      where.data_hora_prevista = {
        gte: new Date(query.data_inicio), 
        lte: new Date(query.data_fim),   
      };
    }

    return this.prisma.administracaoMedicamento.findMany({
      where: where,
      include: {
        paciente: { select: { nome_completo: true } },
        prescricao: { 
          select: {
            dosagem: true,
            quantidade_por_dose: true,
            produto: { 
              select: { nome: true }, 
            },
          },
        },
        usuario_administrou: { select: { nome_completo: true } },
      },
      orderBy: {
        data_hora_prevista: 'desc', 
      },
    });
  }

  async findOne(id: number, usuarioLogado: Usuario) {
    const administracao = await this.getAdministracao(
      id,
      usuarioLogado.clinicaId,
    );
    
    return this.prisma.administracaoMedicamento.findUnique({
      where: { id: administracao.id },
      include: {
        paciente: { select: { nome_completo: true } },
        prescricao: { 
          select: {
            dosagem: true,
            posologia: true,
            produto: { 
              select: { nome: true },
            },
          },
        },
        usuario_administrou: { select: { nome_completo: true } },
      },
    });
  }
}