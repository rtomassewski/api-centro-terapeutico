// src/administracao-medicamentos/administracao-medicamentos.service.ts
import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { CreateAdministracaoMedicamentoDto } from './dto/create-administracao-medicamento.dto';
import { UpdateAdministracaoMedicamentoDto } from './dto/update-administracao-medicamento.dto';
import { PrismaService } from '../prisma.service';
import { StatusAdministracao, Usuario } from '@prisma/client';
import { AdministrarMedicamentoDto } from './dto/administrar-medicamento.dto';


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
    // (A prescrição já está ligada ao paciente, então a checagem é robusta)
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
        data_hora_prevista: new Date(dto.data_hora_prevista), // Converte a string
        notas: dto.notas,
        status: StatusAdministracao.PENDENTE,
        clinicaId: clinicaId, // Segurança: Pega do token
        pacienteId: dto.pacienteId,
        prescricaoId: dto.prescricaoId,
        // usuario_administrouId fica NULO até alguém administrar
      },
    });
  }

  async administrar(
    id: number,
    dto: AdministrarMedicamentoDto,
    usuarioLogado: Usuario,
  ) {
    // 1. Segurança: Valida se o registro existe e é da clínica do usuário
    const administracao = await this.getAdministracao(
      id,
      usuarioLogado.clinicaId,
    );

    // 2. Regra de Negócio: Só pode administrar o que está PENDENTE
    if (administracao.status !== StatusAdministracao.PENDENTE) {
      throw new ConflictException(
        `Esta medicação já foi processada (Status: ${administracao.status}).`,
      );
    }

    // 3. Atualiza o registro
    return this.prisma.administracaoMedicamento.update({
      where: { id: id },
      data: {
        status: dto.status,
        notas: dto.notas,
        // 4. Auditoria: Grava QUEM e QUANDO
        data_hora_administracao: new Date(), // A hora exata da checagem
        usuarioAdministrouId: usuarioLogado.id, // O ID do técnico logado
      },
    });
  }

  // (Vamos implementar os outros métodos do CRUD depois)
  findAll() {
    return `This action returns all administracaoMedicamentos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} administracaoMedicamento`;
  }

  update(id: number, updateDto: UpdateAdministracaoMedicamentoDto) {
    return `This action updates a #${id} administracaoMedicamento`;
  }

  remove(id: number) {
    return `This action removes a #${id} administracaoMedicamento`;
  }
}